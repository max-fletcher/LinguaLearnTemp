import sgMail from '@sendgrid/mail';
import fs from 'fs';
import path from 'path';
import { CustomException } from '../errors/CustomException.error';

export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  }

  async injectVariables(
    template: string,
    variables: Record<string, string>,
  ): Promise<string> {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    }
    return result;
  }

  async sendEmailInvitation(name: string, email: string, userType: string, link: string) {
    try {
      const htmlPath = path.join(
        __dirname,
        '..',
        '..',
        'src',
        'views',
        'email',
        'invitation_email.html',
      );
      let htmlTemplate = fs.readFileSync(htmlPath, 'utf8');

      htmlTemplate = await this.injectVariables(htmlTemplate, {
        name: name,
        userType: userType,
        link: link,
      });

      const msg = {
        to: email,
        from: process.env.SENDGRID_EMAIL_VERIFICATION_OTP_FROM_EMAIL as string,
        subject: 'Home Run Invitation',
        html: htmlTemplate,
      };

      await sgMail.send(msg);

      return true;
    } catch (error) {
      // console.log(error);
      throw new CustomException('Something went wrong', 500);
    }
  }
}

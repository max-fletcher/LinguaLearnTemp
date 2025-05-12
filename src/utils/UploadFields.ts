import { fieldNames } from './common.utils';

interface UploadFieldType {
  [key: string]: any;
}

const uploadFields: UploadFieldType = {};

class UploadFields {
  fields: any = [];
  static getFields(config: any) {
    if (!uploadFields[config.fieldName]) {
      let fieldsInstance;
      switch (config.fieldName) {
        case fieldNames.AVATAR:
          fieldsInstance = new UserProfileField();
          break;
        default:
          break;
      }
      uploadFields[config.fieldName] = fieldsInstance?.fields ?? [];
    }

    return uploadFields[config.fieldName];
  }
}

class UserProfileField extends UploadFields {
  constructor() {
    super();
    this.fields = [{ name: 'avatar', maxCount: 1 }];
  }
}

export default UploadFields;

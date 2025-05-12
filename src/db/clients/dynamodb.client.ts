import * as dynamoose from 'dynamoose';
import { getEnvVar } from '../../utils/common.utils';

export function connectDynamoDB() {
  const ddb = new dynamoose.aws.ddb.DynamoDB({
    credentials: {
      accessKeyId: getEnvVar('AWS_ACCESS_KEY'),
      secretAccessKey: getEnvVar('AWS_SECRET_KEY'),
    },
    region: getEnvVar('AWS_REGION'),
  });
  dynamoose.aws.ddb.set(ddb);
}

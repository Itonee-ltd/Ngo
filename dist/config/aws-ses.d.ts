import AWS from 'aws-sdk';
export declare const sendAwsEmail: (to: string, subject: string, htmlBody: string, textBody?: string) => Promise<import("aws-sdk/lib/request").PromiseResult<AWS.SES.SendEmailResponse, AWS.AWSError>>;
//# sourceMappingURL=aws-ses.d.ts.map
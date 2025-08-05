"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAwsEmail = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
aws_sdk_1.default.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1'
});
const ses = new aws_sdk_1.default.SES({ apiVersion: '2010-12-01' });
const sendAwsEmail = async (to, subject, htmlBody, textBody) => {
    const params = {
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: htmlBody,
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: textBody || htmlBody.replace(/<[^>]*>/g, ''),
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject,
            },
        },
        Source: process.env.FROM_EMAIL || 'noreply@ngogrants.org',
        ReplyToAddresses: [process.env.FROM_EMAIL || 'noreply@ngogrants.org'],
    };
    try {
        const result = await ses.sendEmail(params).promise();
        console.log('Email sent successfully:', result.MessageId);
        return result;
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
exports.sendAwsEmail = sendAwsEmail;
//# sourceMappingURL=aws-ses.js.map
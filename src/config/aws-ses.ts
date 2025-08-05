
import AWS from 'aws-sdk';

// Configure AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1'
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

export const sendAwsEmail = async (
    to: string, 
    subject: string, 
    htmlBody: string, 
    textBody?: string
) => {
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
                    Data: textBody || htmlBody.replace(/<[^>]*>/g, ''), // Strip HTML for text
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
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
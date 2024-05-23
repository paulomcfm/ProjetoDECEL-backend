import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Configurações do seu provedor de e-mail usando variáveis de ambiente
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_PROVIDER,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Função para enviar e-mail com o código
export default async function enviarCodigo(destinatario, codigo) {
    try {
        // Opções do e-mail
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: destinatario,
            subject: 'Código de Verificação',
            text: `Seu código de verificação é: ${codigo}`
        };

        // Envia o e-mail e aguarda a resposta
        const info = await transporter.sendMail(mailOptions);
        
        // Verifica se a resposta foi bem-sucedida
        if (info && info.response) {
            console.log('E-mail enviado com sucesso:', info.response);
            return true; // Indica que o e-mail foi enviado com sucesso
        } else {
            console.error('Erro ao enviar e-mail. Resposta indefinida:', info);
            return false; // Indica que houve um erro ao enviar o e-mail
        }
    } catch (error) {
        console.error('Erro ao enviar e-mail: ', error);
        return false; // Indica que houve um erro ao enviar o e-mail
    }
}
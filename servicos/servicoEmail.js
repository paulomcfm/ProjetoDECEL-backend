import nodemailer from "nodemailer";

// Configurações do seu provedor de e-mail (substitua com suas próprias credenciais)
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_PROVIDER,
    auth: {
        user: process.env.EMAIL_USER,
        // Adicione a senha aqui se necessário
    }
});

// Função para enviar e-mail com o código
export default async function enviarCodigo(destinatario, codigo) {
    try {
        // Opções do e-mail
        const mailOptions = {
            from: process.env.EMAIL_USER, // Usar o mesmo e-mail que está autenticado
            to: destinatario,
            subject: 'Código de Verificação',
            text: `Seu código de verificação é: ${codigo}`
        };

        // Envia o e-mail e aguarda a resposta (utilizando async/await)
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
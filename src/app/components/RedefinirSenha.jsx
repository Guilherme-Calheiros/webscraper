import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

export default function RedefinirSenha({user, url}) {
    return (
        <Html>
            <Head />
            <Preview>Redefinir sua senha</Preview>
            <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>Redefinir Senha</Heading>
                <Text style={text}>Olá {user.name},</Text>
                <Text style={text}>
                    Recebemos uma solicitação para redefinir a senha da sua conta.
                    Clique no botão abaixo para criar uma nova senha.
                </Text>
                <Section style={buttonContainer}>
                <Button style={button} href={url}>
                    Redefinir Senha
                </Button>
                </Section>
                <Text style={text}>
                    Ou copie e cole este link no seu navegador:
                </Text>
                <Link href={url} style={link}>
                    {url}
                </Link>
                <Section style={warningBox}>
                <Text style={warningText}>
                    ⚠️ Se você não solicitou a redefinição de senha, ignore este email.
                    Sua senha permanecerá inalterada.
                </Text>
                </Section>
                <Text style={footer}>
                    Este link expira em 1 hora por motivos de segurança.
                </Text>
            </Container>
            </Body>
        </Html>
    );
}

const main = {
  backgroundColor: '#f6f9fc',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '580px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
};

const buttonContainer = {
  padding: '27px 0',
  textAlign: 'center',
};

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'block',
  width: '200px',
  padding: '14px 0',
  margin: '0 auto',
};

const link = {
  color: '#dc2626',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all',
  padding: '0 40px',
  display: 'block',
};

const warningBox = {
  backgroundColor: '#fef3c7',
  border: '1px solid #fde047',
  borderRadius: '5px',
  margin: 'auto',
  padding: '16px',
  maxWidth: '500px',
};

const warningText = {
  color: '#92400e',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '10px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 40px',
  marginTop: '32px',
};
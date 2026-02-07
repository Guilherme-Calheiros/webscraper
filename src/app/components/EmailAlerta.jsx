import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';
import { formatarMoeda } from '../utils/preco';

export default function EmailAlerta({ 
    targetPrice,
    currentPrice,
    productName,
    productUrl 
}) {
    const priceDifference = currentPrice - targetPrice;
    const percentageDifference = ((priceDifference / targetPrice) * 100).toFixed(1);

    return (
        <Html>
            <Head />
            <Preview>O preço do {productName} caiu!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Text style={headerText}>Alerta de Preço</Text>
                    </Section>

                    <Heading style={h1}>Boa notícia!</Heading>

                    <Text style={text}>
                        O produto que você está acompanhando atingiu o <strong>valor desejado</strong>!
                    </Text>

                    <Section style={productSection}>
                        <Text style={productNameStyle}>{productName}</Text>

                        <Section style={priceSection}>
                            <div style={oldPriceContainer}>
                                <Text style={oldPriceLabel}>Preço atual:</Text>
                                <Text style={oldPriceValue}>{formatarMoeda(currentPrice)}</Text>
                            </div>

                            <div style={newPriceContainer}>
                                <Text style={newPriceLabel}>Preço desejado:</Text>
                                <Text style={newPriceValue}>{formatarMoeda(targetPrice)}</Text>
                            </div>
                        </Section>

                        <Section style={discountBadge}>
                            <Text style={discountText}>{percentageDifference}% OFF</Text>
                        </Section>
                    </Section>

                    <Section style={buttonContainer}>
                        <Button style={button} href={productUrl}>
                            Ver Produto
                        </Button>
                    </Section>

                    <Section style={infoSection}>
                        <Text style={text}>
                            Este alerta foi desativado automaticamente para evitar notificações repetidas. Se quiser acompanhar novamente, basta reativar o alerta no site.
                        </Text>
                    </Section>

                    <Hr style={hr} />

                    <Text style={footer}>
                        Você está recebendo este email porque ativou alertas de preço para este produto.
                        Para gerenciar suas preferências de notificação, acesse suas configurações.
                    </Text>
                </Container>
            </Body>
        </Html>
    )
};

const main = {
    backgroundColor: '#f6f9fc',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 48px',
    marginBottom: '64px',
    maxWidth: '580px',
};

const header = {
    backgroundColor: '#ffcc00',
    padding: '16px 40px',
    textAlign: 'center',
};

const headerText = {
    color: '#000',
    fontSize: '14px',
    fontWeight: 'bold',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '1px',
};

const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '32px 0 24px',
    padding: '0 40px',
};

const text = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px',
    padding: '0 40px',
};

const productSection = {
    padding: '24px 40px',
    backgroundColor: '#f9fafb',
    margin: '24px auto',
    borderRadius: '8px',
    textAlign: 'center',
};

const productNameStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: '16px 0',
};

const priceSection = {
    margin: '24px auto',
    gap: '16px',
};

const oldPriceContainer = {
    textAlign: 'center',
};

const oldPriceLabel = {
    fontSize: '12px',
    color: '#6b7280',
    margin: '0 0 4px 0',
    textTransform: 'uppercase',
};

const oldPriceValue = {
    fontSize: '18px',
    color: '#9ca3af',
    textDecoration: 'line-through',
    margin: 0,
};

const newPriceContainer = {
    textAlign: 'center',
};

const newPriceLabel = {
    fontSize: '12px',
    color: '#6b7280',
    margin: '0 0 4px 0',
    textTransform: 'uppercase',
};

const newPriceValue = {
    fontSize: '28px',
    color: '#16a34a',
    fontWeight: 'bold',
    margin: 0,
};

const discountBadge = {
    backgroundColor: '#dc2626',
    borderRadius: '20px',
    display: 'inline-block',
    padding: '8px 20px',
    margin: '16px auto',
    maxWidth: 'fit-content',
};

const discountText = {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    margin: 0,
};

const buttonContainer = {
    padding: '32px 0',
    textAlign: 'center',
};

const button = {
    backgroundColor: '#0f1729',
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

const hr = {
    borderColor: '#e5e7eb',
    margin: '32px 40px',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '18px',
    padding: '0 40px',
};

const infoSection = {
    color: '#6b7280',
    fontSize: '14px',
    margin: '24px auto',
};
import { paypalConfig } from "../config/paypal.config";
import db from '../config/db.config'

function getBasicAuth() : string {
    return Buffer.from(`${paypalConfig.clientId}:${paypalConfig.clientSecret}`).toString('base64');
}

export async function getAccessToken() : Promise<string> {
    const response = await fetch(`${paypalConfig.baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${getBasicAuth()}`
        },
        body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
}

export async function createPaypalOrder(
    total: number,
    items: {
        nombre: string;
        precio: number;
        cantidad: number
    }[]) : Promise<{
        id: string;
        status: string;
    }> {
    const accessToken = await getAccessToken();
    const body = {
        intent: 'CAPTURE',
        purchase_units: [
            {
                amount: {
                    currency_code: 'MXN',
                    value: total.toFixed(2),
                    breakdown: {
                        item_total: {
                            currency_code: 'MXN',
                            value: total.toFixed(2)
                        }
                    }
                },
                items: items.map(item => ({
                    name: item.nombre,
                    unit_amount: {
                        currency_code: 'MXN',
                        value: item.precio
                    },
                    quantity: item.cantidad.toString()
                }))
            }
        ]
    };

    const response = await fetch(`${paypalConfig.baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(body)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to create order: ${response.statusText}`);
    }

    const data = await response.json();
    return {id: data.id, status: data.status}; 
}

export async function capturePaypalOrder(orderId: string) : Promise<void> {
    const accessToken = await getAccessToken();
    
    const response = await fetch(`${paypalConfig.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });
    
    if (!response.ok) {
        throw new Error(`Failed to capture order: ${response.statusText}`);
    }
}
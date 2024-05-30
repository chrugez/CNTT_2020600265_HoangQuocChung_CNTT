
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { useEffect } from "react";
import { apiCreateOrder } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import path from "../../ultils/path";
import { clearCart } from "../../store/user/userSlice";

// This value is from the props in the UI
const style = { "layout": "vertical" };

function createOrder({ data, actions }) {
    // replace this url with your server
    return fetch("https://react-paypal-js-storybook.fly.dev/api/paypal/create-order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        // use the "body" param to optionally pass additional order information
        // like product ids and quantities
        body: JSON.stringify({
            cart: [
                {
                    sku: "1blwyeo8",
                    quantity: 2,
                },
            ],
        }),
    })
        .then((response) => response.json())
        .then((order) => {
            // Your code here after create the order
            return order.id;
        });

}
function onApprove(data) {
    // replace this url with your server
    return fetch("https://react-paypal-js-storybook.fly.dev/api/paypal/capture-order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            orderID: data.orderID,
        }),
    })
        .then((response) => response.json())
        .then((orderData) => {
            // Your code here after capture the order
        });
}

// Custom component to wrap the PayPalButtons and show loading spinner
const ButtonWrapper = ({ showSpinner, currency, amount, payload }) => {
    const [{ isPending, options }, dispatch] = usePayPalScriptReducer();
    const navigate = useNavigate()
    const dispatchRedux = useDispatch()
    useEffect(() => {
        dispatch({
            type: 'resetOptions',
            value: {
                ...options, currency: currency
            }
        })
    }, [currency, showSpinner])

    const handleSaveOrder = async () => {
        const response = await apiCreateOrder(payload)
        if (response.success) {
            dispatchRedux(clearCart({ currentCart: [] }))
            toast.success('Order success! Your order is delivering!')
            navigate(`/${path.MEMBER}/${path.HISTORY}`)
        }
    }

    return (
        <>
            {(showSpinner && isPending) && <div className="spinner" />}
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[style, currency, amount]}
                fundingSource={undefined}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            { amount: { currency_code: currency, value: amount } }
                        ]
                    }).then(orderId => orderId)
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then(async (response) => {
                        if (response.status === 'COMPLETED') {
                            handleSaveOrder()
                        }
                    })
                }}
            />
        </>
    );
}

export default function Paypal({ amount, payload }) {
    return (
        <div style={{ maxWidth: "750px", minHeight: "200px", margin: 'auto' }}>
            <PayPalScriptProvider options={{ clientId: "test", components: "buttons", currency: "USD" }}>
                <ButtonWrapper payload={payload} currency={'USD'} amount={amount} showSpinner={false} />
            </PayPalScriptProvider>
        </div>
    );
}
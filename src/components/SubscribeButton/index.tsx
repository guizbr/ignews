import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
    priceID: string;
}

export function SubscribeButton({ priceID }: SubscribeButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();

    async function handleSubscribe() {
        if (!session){
            signIn('github')
            return;
        }

        if (session?.activeSubscription) {
            router.push('/posts');
            return;
        }

        try{
            const response = await api.post('/subscribe');

            const { sessionId } = response.data;
            console.log(sessionId);
            const stripe = await getStripeJs();
            console.log(stripe);
            await stripe.redirectToCheckout({ sessionId });
        } catch (err) {
            alert('Error: ' + err.message);
        }
    }

    return (
        <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
            Subscribe now
        </button>
    );
}
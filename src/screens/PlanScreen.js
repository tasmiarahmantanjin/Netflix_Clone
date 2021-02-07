import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import db from '../firebase';
import './PlanScreen.css'
import { loadStripe } from '@stripe/stripe-js';

function PlanScreen() {
	const [products, setProducts] = useState([]);
	const user = useSelector(selectUser);
	const [subscription, setSubscription] = useState(null);

	useEffect(() => {
		db.collection("customers")
			.doc(user.uid)
			.collection("subscriptions")
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(async (subscription) => {
					setSubscription({
						role: subscription.data().role,
						current_period_end: subscription.data().current_period_end.seconds,
						current_period_start: subscription.data().current_period_start.seconds,
				});
			});
		});

	}, [user.uid]);

	useEffect(() => {
		db.collection('products')
		.where('active', '==', true)
		.get()
		.then((querySnapshot) => {
			const products = {};
			querySnapshot.forEach(async productDoc => {
				products[productDoc.id] = productDoc.data();
				const priceSnap = await productDoc.ref.collection('prices').get();
				priceSnap.docs.forEach(price => {
					products[productDoc.id].prices = {
						priceId: price.id,
						priceData: price.data()
					}
				})
			})
			setProducts(products)
		});
	}, [])

	console.log(products);
	console.log(subscription);

	const loadCheckOut = async (priceId) => {
		const docRef = await 
		db.collection('customers')
		.doc(user.uid)
		.collection("checkout_sessions")
		.add({
			price: priceId,
			success_url: window.location.origin,
			cancel_url: window.location.origin
		});

		docRef.onSnapshot(async (snap) => {
			const { error, sessionId } = snap.data();

			if (error) {
				// Show an error to your customer and 
				// inspect your Cloud functions logs in the firebase console.
				alert(`Oops something is wrong! ${error.message}`)
			}

			if (sessionId) {
				// we have a session, let's redirect to CheckOut
				// Init Stripe

				const stripe = await loadStripe('pk_test_51IHlreDWEy5nFASvThKHbkJz19WsX7GnOiED8RMkA0fDZA3SaKhoEjQgxm8cBMWAcsrWzcAZwit04yOPP8HMKIeU00LKefXzbl');
				stripe.redirectToCheckout({ sessionId });
			}
		})
	};

	return (
		<div className="planScreen">
			<br />
			{subscription && (
				<p>
					Renewal Date:{" "}
					{new Date
						(subscription?.current_period_end * 1000)
						.toLocaleDateString()}
				</p>
			)}

			{Object.entries(products).map(([productID, productData]) => {
				const isCurrentPackage = productData.name
				?.toLowerCase()
				.includes(subscription?.role);

				return(
					<div
						key={productID}
						className={`${
							isCurrentPackage && "planScreen__plan--disabled"
							} planScreen__plan`}
					>
						<div className="planScreen__info">
							<h5>{productData.name}</h5>
							<h6>{productData.description}</h6>
						</div>

						<button
							onClick={() =>
								!isCurrentPackage && loadCheckOut(productData.prices.priceId)
								}
							>
								{isCurrentPackage ? "Current Package" : "Subscribe"}
						</button>
					</div>
				);
			})}
		</div>
	);
}

export default PlanScreen;

import {useEffect, useState} from "react";

export const useFetchPayments = (type, selectedDate) => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPayments() {
            setLoading(true);
            const res = await fetch("/api/main/payments?type=" + type + "&date=" + selectedDate);
            const payments = await res.json();
            if (!payments || !payments.data) {
                setPayments([]);
                setLoading(false);
                return;
            }
            setPayments(payments.data);
            setLoading(false);
        }

        fetchPayments();
    }, [selectedDate]);

    return {payments, loading, setPayments};
};

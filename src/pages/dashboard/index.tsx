import { useState } from 'react'

import { canSSRAuth } from '../../utils/canSSRAuth';
import Head from 'next/head'

import { Header } from '../../components/Header/'
import styles from './styles.module.scss'

import { FiRefreshCcw } from 'react-icons/fi';

import { setupAPIClient } from '../../services/api'

import Modal from 'react-modal'
import { ModalOrder } from '../../components/ModalOrder'

type OrderProps = {
    id: string;
    table: string | number;
    status: boolean;
    draft: boolean;
    name: string | null;

}

export type OrderItemProps = {
    id: string;
    amount: number;
    orderId: string;
    productId: string;
    product: {
        id: string;
        name: string;
        description: string;
        price: string;
        banner: string;
    };
    order: {
        table: string | number;
        status: boolean
    }
}

interface HomeProps {
    orders: OrderProps[];
}

export default function Dashboard({ orders }: HomeProps) {

    const [orderList, setOrderList] = useState(orders || []);

    const [modalItem, setModalItem] = useState<OrderItemProps[]>();
    const [modalVisible, setModalVisible] = useState(false);

    function handleCloseModal() {
        setModalVisible(false);
    }

    async function handleOpenOrderDetails(orderId: string) {
        const api = setupAPIClient();
        const response = await api.get('order/detail', {
            params: {
                orderId: orderId,
            }
        });

        setModalItem(response.data);
        setModalVisible(true);
    }

    async function handleFinishOrder(id: string) {
        const api = setupAPIClient();
        await api.put('/order/finish', {
            orderId: id,
        });

        const response = await api.get("/orders");

        setOrderList(response.data);
        setModalVisible(false);
    }

    async function handleRefreshOrders() {
        const api = setupAPIClient();

        const response = await api.get("/orders");

        setOrderList(response.data);
    }

    Modal.setAppElement('#__next');

    return (
        <>
            <Head>
                <title>Painel - PizzApp</title>
            </Head>

            <div>
                <Header />

                <main className={styles.container}>
                    <div className={styles.containerHeader}>
                        <h1>Últimos pedidos</h1>

                        <button onClick={handleRefreshOrders}>
                            <FiRefreshCcw
                                color="#c3c750"
                                size={25} />
                        </button>
                    </div>

                    <article className={styles.listOrders}>

                        {orderList.length === 0 && (
                            <span className={styles.emptyList}>
                                Nenhum pedido encontrado..
                            </span>
                        )}

                        {orderList.map(order => (
                            <section key={order.id} className={styles.orderItem}
                                onClick={() => handleOpenOrderDetails(order.id)}>
                                <button>
                                    <div className={styles.tag}></div>
                                    <span>Mesa {order.table}</span>
                                </button>
                            </section>
                        ))}


                    </article>
                </main>

                {modalVisible && (
                    <ModalOrder
                        isOpen={modalVisible}
                        onRequestClose={handleCloseModal}
                        order={modalItem}
                        handleFinishOrder={handleFinishOrder} />
                )}
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const api = setupAPIClient(ctx);
    const response = await api.get('/orders');

    return {
        props: {
            orders: response.data
        }
    }
});

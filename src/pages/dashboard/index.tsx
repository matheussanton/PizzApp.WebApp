import { canSSRAuth } from '../../utils/canSSRAuth';
import Head from 'next/head'

import { Header } from '../../components/Header/'
import styles from './styles.module.scss'

import { FiRefreshCcw } from 'react-icons/fi';

export default function Dashboard() {
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

                        <button>
                            <FiRefreshCcw
                                color="#c3c750"
                                size={25} />
                        </button>
                    </div>

                    <article className={styles.listOrders}>

                        <section className={styles.orderItem}>
                            <button>
                                <div className={styles.tag}></div>

                                <span>Mesa X</span>
                            </button>
                        </section>


                    </article>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    }
});

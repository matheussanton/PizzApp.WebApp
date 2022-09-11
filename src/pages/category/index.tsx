import Head from 'next/head'
import { Header } from '../../components/Header'
import styles from './styles.module.scss'

import { useState, FormEvent } from 'react';

import { setupAPIClient } from '../../services/api'
import { toast } from 'react-toastify';

import { canSSRAuth } from '../../utils/canSSRAuth'


export default function Category() {

    const [name, setName] = useState('');

    async function handleRegister(event: FormEvent) {
        event.preventDefault();

        if (name == "") {
            return;
        }

        const apiClient = setupAPIClient();
        await apiClient.post('/category', {
            name: name
        });

        toast.success("Categoria cadastrada com sucesso.");

        setName('');
    }

    return (
        <>
            <Head>
                <title>Nova Categoria</title>
            </Head>

            <div>
                <Header />
                <main className={styles.container}>
                    <h1>Cadastrar categorias</h1>

                    <form onSubmit={handleRegister} className={styles.form}>
                        <input type="text"
                            placeholder="Digite o nome da catetoria"
                            className={styles.input}
                            onChange={(e) => setName(e.target.value)}
                            value={name} />

                        <button type="submit"
                            className={styles.buttonAdd}>
                            Cadastrar
                        </button>
                    </form>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})

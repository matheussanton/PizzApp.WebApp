import {useState, FormEvent, useContext} from 'react'

import Head from 'next/head'
import Image from 'next/image'
import styles from '../../../styles/home.module.scss'

import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

import logoImg from '../../../public/logo.svg'

import {AuthContext} from '../../contexts/AuthContext'

import Link from 'next/link';

import {toast} from 'react-toastify'

export default function SignUp() {

    const {signUp} = useContext(AuthContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleSignUp(event: FormEvent){
        event.preventDefault();

        if(email === '' || password === '' || name === '') {
            toast.warning("Preencha todos os campos.");
            return;
          }

          setLoading(true);

          let data = {
            name,
            email,
            password
          }

          signUp(data);
          
          setLoading(false);
    }
    return (
        <>
            <Head>
                <title>PizzApp - Cadastro</title>
            </Head>
            <div className={styles.containerCenter}>
                <Image src={logoImg} alt='Logo PizzApp'></Image>

                <div className={styles.login}>
                    <h1>Cadastro</h1>

                    <form onSubmit={handleSignUp}>
                        <Input placeholder="Nome"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            />

                        <Input placeholder="E-mail"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />

                        <Input placeholder="Senha"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />

                        <Button
                            type="submit"
                            loading={loading}
                        >
                            Cadastrar
                        </Button>


                    </form>

                    <Link href="/">
                        <a className={styles.text}>
                            Já possui uma conta? Faça Login.
                        </a>
                    </Link>

                </div>
            </div>
        </>
    )
}

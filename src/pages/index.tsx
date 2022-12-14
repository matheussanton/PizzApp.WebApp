import { useContext, useState, FormEvent } from 'react'
import { canSSRGuest } from '../utils/canSSRGuest';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/home.module.scss'

import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

import logoImg from '../../public/logo.svg'

import Link from 'next/link';

import { AuthContext } from '../contexts/AuthContext'

import { toast } from 'react-toastify'


export default function Home() {

  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (email === '' || password === '') {
      toast.warning("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    let data = {
      email,
      password,
    }

    await signIn(data);

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>PizzApp - Faça seu login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt='Logo PizzApp'></Image>

        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input placeholder="E-mail"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input placeholder="Senha"
              style={{ marginBottom: '0' }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <a
              style={{ marginTop: '10px', marginBottom: '1.5rem', textAlign: 'right', fontSize: '15px', textDecoration: 'none' }}
              className={styles.text}>
              Esqueci minha senha
            </a>

            <Button
              type="submit"
              loading={loading}
            >
              Acessar
            </Button>

          </form>

          <Link href="signup">
            <a className={styles.text}>
              Nao possui uma conta? Cadastre-se!
            </a>
          </Link>

        </div>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {}
  }
});

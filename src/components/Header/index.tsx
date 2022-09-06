import styles from './styles.module.scss'
import Link from 'next/link'
import {FiLogOut} from 'react-icons/fi'

import {AuthContext} from '../../contexts/AuthContext'
import {useContext} from 'react'

export function Header(){

    const {signOut} = useContext(AuthContext)

    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/dashboard">
                    <img src="/logo.svg" alt="Logo" width={190} height={60} />
                </Link>

                {/* <h1>{user?.name}</h1> */}

                <nav className={styles.menuNav}>
                    <Link href="/category">
                        <a>Categoria</a>
                    </Link>

                    <Link href="/product">
                        <a>Cardápio</a>
                    </Link>
                    <button onClick={signOut}>
                        <FiLogOut color="#fff" size={24}/>
                    </button>
                </nav>
            </div>
        </header>
    )
}

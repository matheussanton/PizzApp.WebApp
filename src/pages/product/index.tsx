import Head from 'next/head'
import { Header } from '../../components/Header'
import styles from './styles.module.scss'

import { useState, FormEvent, ChangeEvent } from 'react';

import { setupAPIClient } from '../../services/api'
import { toast } from 'react-toastify';

import { canSSRAuth } from '../../utils/canSSRAuth'

import { FiUpload } from 'react-icons/fi'


type ItemProps = {
    id: string;
    name: string;
}

interface CategoryProps {
    categoryList: ItemProps[];
}

export default function Prodcut({ categoryList }: CategoryProps) {

    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setImageAvatar] = useState(null);

    const [categories, setCategories] = useState(categoryList || []);
    const [selectedCategory, setSelectedCategory] = useState(0);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {

        if (!e.target.files) {
            return;
        }

        const image = e.target.files[0];

        if (!image) {
            return;
        }

        if (image.type === 'image/jpeg' || image.type === 'image/png') {
            setImageAvatar(image);
            setAvatarUrl(URL.createObjectURL(image));
        }

    }

    function handleChangeCategory(e) {
        setSelectedCategory(e.target.value);
    }

    async function handleCreateProduct(event: FormEvent) {

        event.preventDefault();

        try {
            const data = new FormData();

            if (name === '' || price === '' || description === '' || imageAvatar === null) {
                toast.error("Preencha todos os campos");
                return;
            }

            data.append('name', name);
            data.append('price', price);
            data.append('description', description);
            data.append('categoryId', categories[selectedCategory].id);
            data.append('file', imageAvatar);

            const api = setupAPIClient();

            await api.post('/product', data);

            toast.success("Produto cadastrado com sucesso");

        } catch (error) {
            toast.error("Erro ao cadastrar produto.");
        }

        setName('');
        setPrice('');
        setDescription('');
        setImageAvatar(null);
        setAvatarUrl('');

    }

    return (
        <>

            <Head>
                <title>Novo Produto</title>
            </Head>

            <div>
                <Header />

                <main className={styles.container}>
                    <h1>Cadastrar Produto</h1>

                    <form
                        onSubmit={handleCreateProduct}
                        className={styles.form}>

                        <label className={styles.labelAvatar}>
                            <span><FiUpload size={30} color="#FFF" /></span>

                            <input type="file" accept="image/png, image/jpeg"
                                onChange={handleFileUpload} />

                            {avatarUrl && (
                                <img src={avatarUrl}
                                    alt="Foto do produto"
                                    width={250}
                                    height={250}
                                    className={styles.preview}
                                />
                            )}


                        </label>

                        <select
                            value={selectedCategory}
                            onChange={handleChangeCategory}>
                            {categories.map((item, index) => {
                                return (
                                    <option key={item.id} value={index}>
                                        {item.name}
                                    </option>
                                )
                            })}
                        </select>


                        <input type="text"
                            placeholder="Digite o nome do produto"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input type="text"
                            placeholder="Digite o preço"
                            className={styles.input}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <textarea
                            placeholder="Descreva seu produto"
                            className={styles.input}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

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

    const api = setupAPIClient(ctx);
    const response = await api.get('/category');


    return {
        props: {
            categoryList: response.data
        }
    }
})



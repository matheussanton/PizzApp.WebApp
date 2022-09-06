import { createContext, ReactNode, useState, useEffect } from 'react';
import {api} from '../services/apiClient'
import {toast} from 'react-toastify'
import { destroyCookie, setCookie, parseCookies } from 'nookies'
import Router from 'next/router'

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
    try {
        destroyCookie(undefined, '@pizzapp.token');
        Router.push('/');
    } catch (error) {
        console.error('error on signOut')
    }
}

export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>();
    //se user populado = true; se não = false;
    const isAuthenticated = !!user;
    
    useEffect(() => {
        
        //tentar pegar o cookies
        const {'@pizzapp.token' : token} = parseCookies();

        if(token) {
            api.get('/user').then(response => {
                const {id,name,email} = response.data

                setUser({
                    id,
                    name,
                    email
                });
            })
            .catch(() => {
                signOut();
            })
        }
    }, [])

    async function signIn({ email, password }: SignInProps) {
        try {
            
            const response = await api.post('/session', { email: email, password: password})

            const {id, name, token} = response.data;

            setCookie(undefined, '@pizzapp.token', response.data.token, {
                maxAge: 60 * 60 * 24 * 30, //expira em 1 mes
                path: '/' //todos os caminhos terão acesso aos cookies
            })

            setUser({
                id,
                name,
                email
            });

            //Passar para todas as proximas requisicao, o token
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success('Login efetuado com sucesso.');

            //Redirecionar usuário para o dashboard
            Router.push("/dashboard");
            
        } catch (error) {
            toast.error('Erro no login.');
            console.log("Erro ao acessar", error);
        }
    }

    async function signUp({email, name, password} : SignUpProps){
        try {
            const response = await api.post('/user', { email: email, password: password, name: name})
            toast.success('Conta criada com sucesso.');
            Router.push('/');
        } catch (error) {
            toast.error("Erro ao cadastrar");
            console.log("Erro ao acessar", error);
        }
    }


    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            signIn,
            signOut,
            signUp
        }}>
            {children}
        </AuthContext.Provider>
    )
}

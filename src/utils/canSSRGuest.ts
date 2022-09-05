import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import {parseCookies} from 'nookies'


//funcao paginas que so podem ser acessadas pro visitantes (nao logados)
export function canSSRGuest<P>(fn: GetServerSideProps<P>){
    return async (context : GetServerSidePropsContext) : Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(context);

        //Se tentar acessar a página e ja possuir login, retorna.
        if(cookies['@pizzapp.token']){
            return{
                redirect: {
                    destination: '/dashboard',
                    permanent: false,
                }
            }
        }

        return await fn(context);
    }
}

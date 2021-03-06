import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Redirect } from 'react-router-dom';
import { useState } from 'react';
import { required } from '../../utils/validators';
import { FormInput } from '../../components/common/Input';
import { makeLoginRequest, getUserRequest } from '../../api';
import Spinner from '../../components/common/Spinner';
import withAuth from '../../hocs/withAuth';

const Login = ({ login }) => {
    const [state, setState] = useState(false);

    /*useEffect(() => {
       const getData = async () => {
            try{
                let r = await getUserRequest();
                if(r.resultCode === 0) {
                    login(r.data);
                }
                console.log("here");
                setState(true);
            }
            catch (err) {}
        }
        //if(!hasAuth) getData();
        //else setState(true);   
    },[state])*/

    return (
        <Formik
        initialValues={{ email: '', password: '', error: '' }}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
                let { email, password } = values;
                let response = await makeLoginRequest(email, password);
                if(response.resultCode === 0) {
                    let me = await getUserRequest();
                    if(me.resultCode === 0) {
                        login(me.data);
                        setState(true);
                        window.location.replace('/');
                    }
                    else {
                        setErrors({ error: "Щось пішло не так, спробуйте пізніше" })
                    }
                } 
                else {
                    setErrors({ error: response.message });
                }
                setSubmitting(false);
            } 
            catch (err) {
                setErrors({ error: "Щось пішло не так, спробуйте пізніше" })
            }
        }}
        >
            {({ isSubmitting }) => (
                isSubmitting ? <div className="col"><Spinner /></div> :
                state ? <Redirect to="/" /> :
                <Form autoComplete={"off"} className="search-form d-flex flex-column mb-5">
                    <h4 className="text-center text-dark mt-3">Вхід</h4>
                    <div className="mb-3">
                        <Field name="email" label="Електронна пошта:" id="email" validate={required} type="email" placeholder="Електронна пошта" component={FormInput} />
                    </div>
                    <div className="mb-3">
                        <Field name="password" label="Пароль:" id="password" validate={required} type="password" placeholder="Пароль" component={FormInput} />
                    </div>
                    <ErrorMessage name="error" className="text-center text-danger mt-2 mb-5" component="div" />
                    <div className="container d-flex justify-content-center">
                        <button type="submit" className="btn btn-dark">Увійти</button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default withAuth(Login);
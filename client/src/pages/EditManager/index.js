import { useState, useEffect } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { compose } from 'redux';
import { getManagerQuery, editManagerQuery } from '../../api';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { required } from '../../utils/validators';
import { FormInput } from '../../components/common/Input';
import withoutAuthRedirect from '../../hocs/withoutAuthRedirect';
import Spinner from '../../components/common/Spinner';

const EditManager = ({ match }) => {
    const [state, setState] = useState(null);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        const getData = async () => {
            let r = await getManagerQuery(match.params.id);
            setState(r);
        }
        if(!state) getData();
    }, [match.params.id, state])

    return (
        <>
            {redirect && <Redirect to={`/managers`} />}
            <h4 className="text-center text-dark mt-4 mb-4">Редагування даних реєстратора:</h4>
            {state ? <Formik
            initialValues={{...state, error: '' }}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
                try {
                    let resp = await editManagerQuery({...values, id: state.id });
                    if(resp.resultCode === 0) {
                        setRedirect(true);
                    } else {
                        setErrors({ error: resp.message })
                    }
                    setSubmitting(false);
                } catch (err) {
                    setErrors({ error: "Щось пішло не так, спробуйте пізніше" })
                }
            }}
            >
                {({ isSubmitting }) => (
                    <Form autoComplete={"off"} className="row mh-auto mb-5">
                        {isSubmitting ? <div className="col"><Spinner /></div> : <><div className="col-4">
                            <div className="mb-3">
                                <Field name="email" label="Електронна пошта:" id="email" validate={required} type="email" placeholder="Електронна пошта" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="password" label="Пароль:" id="password" validate={required} placeholder="Пароль" type="text" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="fullname" label="Повне ім'я:" id="fullname" validate={required} placeholder="Ім'я" type="text" component={FormInput} />
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="mb-3">
                                <Field name="number" label="Номер паспорта:" id="number" validate={required} placeholder="Номер паспорта" type="number" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="agency" label="Орган, що видав:" id="agency" validate={required} placeholder="Орган, що видав" type="number" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="date" label="Дата видачі:" id="date" validate={required} type="date" component={FormInput} />
                            </div>
                        </div>
                        <div className="col-4 mb-3">
                        <div className="mb-3">
                                <Field name="birthdate" label="Дата народження:" id="birthdate" validate={required} type="date" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="series" label="Серія паспорту (якщо є):" id="series" placeholder="Серія паспорту" type="number" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="taxNumber" label="Номер платника податків:" id="taxNumber" validate={required} placeholder="Номер платника податків" type="number" component={FormInput} />
                            </div>
                        </div>
                        <ErrorMessage name="error" className="text-center text-danger mt-2 mb-5" component="div" />
                        <div className="container d-flex justify-content-center">
                            <button type="submit" className="btn btn-dark">Редагувати</button>
                        </div></>}
                    </Form>
                )}
            </Formik> : 
            <div className="container-fluid d-flex align-items-center justify-content-center">
                <Spinner />
            </div>}
        </>
    )
}

export default compose(withoutAuthRedirect, withRouter)(EditManager);
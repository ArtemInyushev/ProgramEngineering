import { Redirect } from 'react-router-dom';
import { useState } from 'react';
import { createManagerQuery } from '../../api';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { required } from '../../utils/validators';
import { FormInput } from '../../components/common/Input';
import withoutAuthRedirect from '../../hocs/withoutAuthRedirect';
import Spinner from '../../components/common/Spinner';

const CreateManager = () => {
    const [redirect, setRedirect] = useState(false);

    return (
        <>
            {redirect && <Redirect to={`/managers`} />}
            <h4 className="text-center text-dark mt-4 mb-4">Створення реєстратора:</h4>
            <Formik
            initialValues={{ fullname: '', organId: 0, date: '', birthday: '', passportNumber: 0, seriesNumber: '', taxpayerNumber: 0, email: '', password: '', error: '' }}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
                try {
                    let resp = await createManagerQuery({...values });
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
                                <Field name="passportNumber" label="Номер паспорта:" id="passportNumber" validate={required} placeholder="Номер паспорта" type="number" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="organId" label="Орган, що видав:" id="organId" validate={required} placeholder="Орган, що видав" type="number" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="date" label="Дата видачі:" id="date" validate={required} type="date" component={FormInput} />
                            </div>
                        </div>
                        <div className="col-4 mb-3">
                        <div className="mb-3">
                                <Field name="birthday" label="Дата народження:" id="birthday" validate={required} type="date" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="seriesNumber" label="Серія паспорту (якщо є):" id="seriesNumber" placeholder="Серія паспорту" type="number" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="taxpayerNumber" label="Номер платника податків:" id="taxpayerNumber" validate={required} placeholder="Номер платника податків" type="number" component={FormInput} />
                            </div>
                        </div>
                        <ErrorMessage name="error" className="text-center text-danger mt-2 mb-5" component="div" />
                        <div className="container d-flex justify-content-center">
                            <button type="submit" className="btn btn-dark">Створити</button>
                        </div></>}
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default withoutAuthRedirect(CreateManager);
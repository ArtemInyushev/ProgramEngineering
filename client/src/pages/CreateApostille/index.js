import { Redirect } from 'react-router-dom';
import { useState } from 'react';
import { createApostilleQuery } from '../../api';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { required } from '../../utils/validators';
import { FormInput } from '../../components/common/Input';
import withoutAuthRedirect from '../../hocs/withoutAuthRedirect';
import Spinner from '../../components/common/Spinner';

const CreateApostille = () => {
    const [redirect, setRedirect] = useState(false);

    return (
        <>
            {redirect && <Redirect to={`/apostilles`} />}
            <h4 className="text-center text-dark mt-4 mb-4">Створення апостиля:</h4>
            <Formik
            initialValues={{ date: '', number: 0, cityName: '', countryName: '', signerName: '', signerPosition: '', signerInst: '', sertName: '', sertPosition: '', sertInst: '', signType: '', error: '' }}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
                try {
                    let resp = await createApostilleQuery({...values });
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
                                <Field name="date" label="Дата видачі апостиля:" id="date" validate={required} type="date" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="number" label="Номер апостиля:" id="number" validate={required} placeholder="Номер апостиля" type="number" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="cityName" label="Місто:" id="cityName" validate={required} placeholder="Місто" type="text" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="countryName" label="Країна:" id="countryName" validate={required} placeholder="Країна" type="text" component={FormInput} />
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="mb-3">
                                <Field name="signerName" label="Підписав:" id="signerName" validate={required} placeholder="Підписав" type="text" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="signerPosition" label="Посада:" id="signerPosition" validate={required} placeholder="Посада(номер)" type="number" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="signerInst" label="Установа:" id="signerInst" validate={required} placeholder="Установа(номер)" type="number" component={FormInput} />
                            </div>
                        </div>
                        <div className="col-4 mb-3">
                        <div className="mb-3">
                                <Field name="sertName" label="Завірив:" id="signerName" validate={required} placeholder="Підписав" type="text" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="sertInst" label="Установа:" id="signerInst" validate={required} placeholder="Установа(номер)" type="number" component={FormInput} />
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

export default withoutAuthRedirect(CreateApostille);
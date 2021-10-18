import { useState, useEffect } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { compose } from 'redux';
import { getApostilleQuery, editApostilleQuery } from '../../api';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { required } from '../../utils/validators';
import { FormInput } from '../../components/common/Input';
import withoutAuthRedirect from '../../hocs/withoutAuthRedirect';
import Spinner from '../../components/common/Spinner';

const EditApostille = ({ match }) => {
    const [state, setState] = useState(null);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        const getData = async () => {
            let r = await getApostilleQuery(match.params.id);
            setState(r);
        }
        if(!state) getData();
    }, [match.params.id, state])

    return (
        <>
            {redirect && <Redirect to={`/apostilles`} />}
            <h4 className="text-center text-dark mt-4 mb-4">Редагування апостиля:</h4>
            {state ? <Formik
            initialValues={{...state, error: '' }}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
                try {
                    let resp = await editApostilleQuery({...values, id: state.id });
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
                                <Field name="city" label="Місто:" id="city" validate={required} placeholder="Місто" type="text" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="country" label="Країна:" id="country" validate={required} placeholder="Країна" type="text" component={FormInput} />
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="mb-3">
                                <Field name="signerName" label="Підписав:" id="signerName" validate={required} placeholder="Підписав" type="text" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="signerPosition" label="Посада:" id="signerPosition" validate={required} placeholder="Посада" type="text" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="signerInst" label="Установа:" id="signerInst" validate={required} placeholder="Установа" type="text" component={FormInput} />
                            </div>
                        </div>
                        <div className="col-4 mb-3">
                        <div className="mb-3">
                                <Field name="sertName" label="Завірив:" id="signerName" validate={required} placeholder="Підписав" type="text" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="sertPosition" label="Посада:" id="signerPosition" validate={required} placeholder="Посада" type="text" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="sertInst" label="Установа:" id="signerInst" validate={required} placeholder="Установа" type="text" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="signType" label="Тип підпису:" id="signType" placeholder="Тип підпису" type="number" max="1" min="0" component={FormInput} />
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

export default compose(withRouter, withoutAuthRedirect)(EditApostille);
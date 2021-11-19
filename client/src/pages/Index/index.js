import { useState } from 'react';
import { findApostille } from '../../api';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { required } from '../../utils/validators';
import { FormInput } from '../../components/common/Input';

const Index = () => {
    const [state, setState] = useState([]);

    return (
        <>
            <Formik
            initialValues={{ number: '', date: '', error: '' }}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
                try {
                    let { number, date } = values;
                    let resp = await findApostille(number, date);
                    debugger;
                    if(resp.resultCode === 0) {
                        if(resp.response.length === 0) setState(null);
                        else setState(resp.response);
                    } else {
                        setErrors({ error: resp.message })
                    }
                    setSubmitting(false);
                } catch (err) {
                    console.log(err)
                    setErrors({ error: "Щось пішло не так, спробуйте пізніше" })
                }
            }}
            >
                {({ isSubmitting }) => (
                    <Form autoComplete={"off"} className="search-form d-flex flex-column mb-5">
                        <h4 className="text-center text-dark mt-4">Пошук за полями:</h4>
                            <div className="mb-3">
                                <Field name="date" label="Дата видачі апостиля:" id="date" validate={required} type="date" component={FormInput} />
                            </div>
                            <div className="mb-3">
                                <Field name="number" label="Номер апостиля:" id="number" validate={required} placeholder="Номер апостиля" type="number" component={FormInput} />
                            </div>
                            <ErrorMessage name="error" className="text-center text-danger mt-2 mb-5" component="div" />
                            <div className="container d-flex justify-content-center">
                                <button type="submit" className="btn btn-dark">Знайти</button>
                            </div>
                    </Form>
                )}
            </Formik>
            <h4 className="text-center text-dark mt-4">Результати пошуку:</h4>
            {state !== null ? 
                <table className="table mt-3 mb-5 text-center">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Номер апостиля</th>
                            <th scope="col">Підписав</th>
                            <th scope="col">Посада</th>
                            <th scope="col">Установа</th>
                            <th scope="col">Проставив</th>
                            <th scope="col">Установа</th>
                            <th scope="col">Дата проставлення</th>
                            <th scope="col">Тип проставлення</th>
                            <th scope="col">Місто</th>
                            <th scope="col">Країна</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.map((item, index) => item.isActive ? <tr>
                            <th scope="row">{++index}</th>
                            <td>{item.number}</td>
                            <td>{item.signerName}</td>
                            <td>{item.signerPosition}</td>
                            <td>{item.signerInst}</td>
                            <td>{item.sertName}</td>
                            <td>{item.sertInst}</td>
                            <td>{item.date.substr(0,10)}</td>
                            <td>{"Печатка"}</td>
                            <td>{item.cityName}</td>
                            <td>{item.countryName}</td>
                        </tr> : <td colspan="11">Шуканий апостиль анульваний</td>)}
                    </tbody>
                </table> : <div className="text-center text-dark">За заданими даними нічого не знайдено</div>
            }
        </>
    )
}

export default Index;
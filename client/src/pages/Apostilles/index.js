import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllApostillesQuery, disableApostilleQuery } from '../../api';
import Spinner from '../../components/common/Spinner';
import withoutAuthRedirect from '../../hocs/withoutAuthRedirect';

const Apostilles = () => {
    const [state, setState] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            let data = await getAllApostillesQuery();
            setState(data);
        }
        if(!state) getData();
    })

    const disable = async (id) => {
        let res = await disableApostilleQuery(id);

        if(res.resultCode === 0) {
            setState(state.map(item => {
                if(item.id[0] === id) item.isActive = false;
                return item;
            }));
        } else {
            setError("Щось пішло не так в процесі анулювання, спробуйте знову пізніше");
            setTimeout(() => setError(null), 3000);
        }
    } 
    
    return (
        <>
            <h4 className="text-center text-dark mt-4">Наявні апостилі:</h4>
            {error && <div className="text-center text-danger">{error}</div>}
            {state ? <table className="table mt-3 mb-3 text-center">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Номер апостиля</th>
                            <th scope="col">Підписав</th>
                            <th scope="col">Посада</th>
                            <th scope="col">Установа</th>
                            <th scope="col">Проставив</th>
                            <th scope="col">Установа</th>
                            <th scope="col">Тип проставлення</th>
                            <th scope="col">Дата проставлення</th>
                            <th scope="col">Місто</th>
                            <th scope="col">Країна</th>
                            <th scope="col">Статус</th>
                            {state.some(item => item.active === 0) && <th scope="col">Дія</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {state.map((item, index) => <tr key={index}>
                            <th scope="row">{++index}</th>
                            <td>{item.number}</td>
                            <td>{item.fullname[0]}</td>
                            <td>{item.positionName}</td>
                            <td>{item.institutionName[0]}</td>
                            <td>{item.fullname[1]}</td>
                            <td>{item.institutionName[1]}</td>
                            <td>{"Печатка"}</td>
                            <td>{item.date.substr(0, 10)}</td>
                            <td>{item.cityName}</td>
                            <td>{item.countryName}</td>
                            <td>{item.isActive ? 'Діючий' : 'Анульований' }</td>
                            <td>
                                {item.isActive && <Link className="btn btn-primary" to={`/edit/${item.id[0]}`}>Редагувати</Link>}
                                {item.isActive && <button onClick={() => disable(item.id[0])} className="btn btn-dark" type="button">Анулювати</button>}
                            </td>
                        </tr>)}
                    </tbody>
                </table> : <div className="container-fluid d-flex justify-content-center align-items-center">
                    <Spinner />
                </div>
            }
        </>
    )
}

export default withoutAuthRedirect(Apostilles);
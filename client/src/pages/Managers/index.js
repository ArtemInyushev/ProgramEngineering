import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllManagersQuery, disableManagerQuery, enableManagerQuery } from '../../api';
import Spinner from '../../components/common/Spinner';
import withoutAuthRedirect from '../../hocs/withoutAuthRedirect';

const Managers = () => {
    const [state, setState] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            let data = await getAllManagersQuery();
            setState(data);
        }
        if(!state) getData();
    })

    const disable = async (id) => {
        let res = await disableManagerQuery(id);

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

    const enable = async (id) => {
        let res = await enableManagerQuery(id);

        if(res.resultCode === 0) {
            setState(state.map(item => {
                debugger;
                if(item.id[0] === id) item.isActive = true;
                return item;
            }));
        } else {
            setError("Щось пішло не так в процесі анулювання, спробуйте знову пізніше");
            setTimeout(() => setError(null), 3000);
        }
    } 
    
    return (
        <>
            <h4 className="text-center text-dark mt-3">Наявні Реєстратори:</h4>
            {error && <div className="text-center text-danger">{error}</div>}
            {state ? <table className="table mt-3 mb-3 text-center">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Електронна почта</th>
                            <th scope="col">Пароль</th>
                            <th scope="col">Ім'я</th>
                            <th scope="col">Номер паспорту</th>
                            <th scope="col">Орган, що видав паспорт</th>
                            <th scope="col">Дата видачі паспорту</th>
                            {state.some(item => item.series !== null) && <th scope="col">Серія паспорту</th>}
                            <th scope="col">Номер платника податків</th>
                            <th scope="col">Дата народження</th>
                            <th scope="col">Статус</th>
                            <th scope="col">Дія</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.map((item, index) => <tr key={index}>
                            <th scope="row">{++index}</th>
                            <td>{item.email}</td>
                            <td>{item.password}</td>
                            <td>{item.fullname}</td>
                            <td>{item.passportNumber}</td>
                            <td>{item.organId}</td>
                            <td>{item.date.substr(0,10)}</td>
                            {state.some(i => i.seriesNumber !== null) && <td>{item.seriesNumber}</td>}
                            <td>{item.taxpayerNumber}</td>
                            <td>{item.birthday.substr(0,10)}</td>
                            <td>{item.isActive ? 'Активований' : 'Деактивований' }</td>
                            <td>
                                <Link className="btn btn-primary" to={`/edit/manager/${item.id[0]}`}>Редагувати</Link>
                                {item.isActive && <button onClick={() => disable(item.id[0])} className="btn btn-dark" type="button">Деактивувати</button>}
                                {!item.isActive && <button onClick={() => enable(item.id[0])} className="btn btn-dark" type="button">Активувати</button>}
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

export default withoutAuthRedirect(Managers);
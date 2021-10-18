import { useState, useEffect } from 'react';
import { getRecentActionsQuery } from '../../api';
import Spinner from '../../components/common/Spinner';
import withoutAuthRedirect from '../../hocs/withoutAuthRedirect';

const Actions = () => {
    const [state, setState] = useState(null);

    useEffect(() => {
        const getData = async () => {
            let data = await getRecentActionsQuery();
            setState(data);
        }
        if(!state) getData();
    })
    
    return (
        <>
            <h4 className="text-center text-dark mt-4">Нещодавні активності:</h4>
            {state ? <table className="table mt-3 mb-3 text-center">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Ім'я Реєстратора</th>
                            <th scope="col">Дата події</th>
                            <th scope="col">Тип події</th>
                            <th scope="col">Номер апостиля</th>
                            <th scope="col">Дата видачі апостиля</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.map((item, index) => <tr key={index}>
                            <th scope="row">{++index}</th>
                            <td>{item.fullname}</td>
                            <td>{new Date(item.date).toLocaleString()}</td>
                            <td>{item.type}</td>
                            <td>{item.number}</td>
                            <td>{item.apostilleDate}</td>
                        </tr>)}
                    </tbody>
                </table> : <div className="container-fluid d-flex justify-content-center align-items-center">
                    <Spinner />
                </div>
            }
        </>
    )
}

export default withoutAuthRedirect(Actions);
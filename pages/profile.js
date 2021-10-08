import Head from 'next/head';
import { useContext, useState, useEffect } from 'react';
import { DataContext } from '../store/GlobalState';
import Link from 'next/link';
import valid from '../utils/valid';
import { patchData } from '../utils/fetchData';
import { imageUpload } from '../utils/imageUpload';


export default function Profile() {
  const initialState = {
    avatar: '',
    name: '',
    password: '',
    cf_password: '',
  };

  const [data, setData] = useState(initialState);
  const { avatar, name, password, cf_password } = data;

  const { state, dispatch } = useContext(DataContext);
  const { auth, notify, orders } = state;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    dispatch({ type: 'NOTIFY', payload: {} });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    if (password) {
      const errMsg = valid(name, auth.user.email, password, cf_password);
      console.log(errMsg);
      if (errMsg)
        return dispatch({ type: 'NOTIFY', payload: { error: errMsg } });
      updatePassword();
    }

    if (name !== auth.user.name || avatar) updateInfor();
  };

  const updatePassword = () => {
    dispatch({ type: 'NOTIFY', payload: { loading: true } });
    patchData('user/resetPassword', { password }, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: 'NOTIFY', payload: { error: res.msg } });
      return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
    });
  };

  const changeAvatar = (e) => {
    const file = e.target.files[0];
    if (!file)
      return dispatch({
        type: 'NOTIFY',
        payload: { error: 'File does not exist.' },
      });

    if (file.size > 1024 * 1024 * 10)
      return dispatch({
        type: 'NOTIFY',
        payload: { error: 'The largest image size is 1mb.' },
      });

    if (file.type !== 'image/jpeg' && file.type !== 'image/png')
      return dispatch({
        type: 'NOTIFY',
        payload: { error: 'Image format is incorrect.' },
      });

    setData({ ...data, avatar: file });
  };

  const updateInfor = async () => {
    let media;
    dispatch({ type: 'NOTIFY', payload: { loading: true } });
    if (avatar) media = await imageUpload([avatar]);
    patchData(
      'user',
      {
        name,
        avatar: avatar ? media[0].url : auth.user.avatar,
      },
      auth.token
    ).then((res) => {
      if (res.err)
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });

      dispatch({
        type: 'AUTH',
        payload: {
          token: auth.token,
          user: res.user,
        },
      });
      return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
    });
  };

  useEffect(() => {
    if (auth.user) setData({ ...data, name: auth.user.name });
  }, [auth.user]);

  if (!auth.user) return null;

  return (
    <div className="profile_page">
      <Head>
        <title>Profile</title>
      </Head>
      <section className="row text-secondary my-3">
        <div className="col-md-4">
          <h3 className="text-cener text-uppercase">
            {auth.user.role === 'user' ? 'User Profile' : 'Admin Profile'}{' '}
            <br />
            <hr />
            <p
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px red, 0 0 1em blue, 0 0 0.2em blue',
              }}
            >
          
              {auth.user.name}
            </p>
          </h3>
          <div className="avatar">
            <img
              src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
              alt="avatar"
            ></img>
            <span>
              <i className="fas fa-camera"></i>
              <p>Change</p>
              <input
                type="file"
                name="file"
                id="file_up"
                onChange={changeAvatar}
                accept="image/*"
              />
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              className="form-control"
              placeholder="your name"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              defaultValue={auth.user.email}
              className="form-control"
              disabled={true}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              name="password"
              value={password}
              className="form-control"
              placeholder="Your new password"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Confirm Password</label>
            <input
              type="password"
              name="cf_password"
              value={cf_password}
              className="form-control"
              placeholder="Confirm new password"
              onChange={handleChange}
            />
          </div>

          <button
            className="btn btn-info"
            disabled={notify.loading}
            onClick={handleUpdateProfile}
          >
            Update
          </button>
        </div>
        <div className="col-md-8 " >
          <h3 className="text-uppercase">Orders</h3>
          <div className="my-3 table-responsive" >
            <table
              className="table-bordered table-hover w-100 text-uppercase "
              style={{ minWidth: '600px', cursor: 'pointer' }}
            >
              <thead className="bg-light fontt-weight-bol">
                <tr>
                  <td className="p-2">id</td>
                  <td className="p-2">date</td>
                  <td className="p-2">total</td>
                  <td className="p-2">delivered</td>
                  <td className="p-2">paid</td>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="p-2">
                    <Link href={`/order/${order._id}`}>
                        <a>{order._id}</a>
                      </Link>
                    </td>
                    <td className="p-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">${order.total}</td>
                    <td className="p-2">
                      {order.delivered
                      ?<i className="fas fa-check text-success"></i>
                      :<i className="fas fa-times text-danger"></i>
                      }
                    </td>
                    <td className="p-2">
                      {order.paid
                      ?<i className="fas fa-check text-success"></i>
                      :<i className="fas fa-times text-danger"></i>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

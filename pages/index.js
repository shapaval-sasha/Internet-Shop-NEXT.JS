import { getData } from '../utils/fetchData';
import { useState, useContext } from 'react';
import { DataContext } from '../store/GlobalState';
import Head from 'next/head';
import ProductItem from '../components/product/ProductItem';

const Home = (props) => {
  const [products, setProducts] = useState(props.products);

  const [isCheck, setIsCheck] = useState(false);

  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };
  const handleCheckAll = () => {
    products.forEach((product) => {
      product.checked = !isCheck;
    });
    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const handleDeleteAll = () => {
    let deleteArr = [];
    products.forEach((product) => {
      if (product.checked) {
        deleteArr.push({
          data: '',
          id: product._id,
          title: 'Delete all selected products?',
          type: 'DELETE_PRODUCT',
        });
      }
    });
    dispatch({
      type: 'ADD_MODAL',
      payload: deleteArr,
    })
  };

  return (
    <div className="home_page">
      <Head>
        <title>Home Page</title>
      </Head>

      {auth.user && auth.user.role === 'admin' && (
        <div
          className="delete_all btn btn-danger mt-2"
          style={{ marginBottom: '-10px' }}
        >
          <input
            type="checkbox"
            checked={isCheck}
            onChange={handleCheckAll}
            style={{
              width: '25px',
              height: '25px',
              transform: 'translateY(8px)',
            }}
          />
          <button
            className="btn btn-danger ml-2"
            data-toggle="modal"
            data-target="#exampleModal"
            onClick={handleDeleteAll}
          >
            DELETE ALL
          </button>
        </div>
      )}

      <div className="products">
        {products.length === 0 ? (
          <h2>No products</h2>
        ) : (
          products.map((product) => (
            <ProductItem
              key={product._id}
              product={product}
              handleCheck={handleCheck}
            />
          ))
        )}
      </div>
    </div>
  );
};
export default Home;

export async function getServerSideProps() {
  const res = await getData('product');
  //console.log(res);
  // server side rendering

  return {
    props: {
      products: res.products,
      result: res.result,
    }, // will be passed to the page component as props
  };
}

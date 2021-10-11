import { getData } from '../utils/fetchData';
import { useState, useContext, useEffect } from 'react';
import { DataContext } from '../store/GlobalState';
import filterSearch from '../utils/filterSearch';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ProductItem from '../components/product/ProductItem';
import Filter from '../components/Filter';


const Home = (props) => {
  const [products, setProducts] = useState(props.products);

  const [isCheck, setIsCheck] = useState(false);
  const [isDisablet, setIsDisablet]= useState(true)
  const [page, setPage] = useState(1);
  const { state, dispatch } = useContext(DataContext);
  const { auth} = state;
  
  const router = useRouter();

  useEffect(() => {
    setProducts(props.products);
  }, [props.products]);

  useEffect(() => {
    if (Object.keys(router.query).length === 0) {
      setPage(1);
    }
  }, [router.query]);

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
    setIsDisablet(false)
  };
  const handleCheckAll = () => {
    products.forEach((product) => {
      product.checked = !isCheck;
    });
    setProducts([...products]);
    setIsCheck(!isCheck);
    setIsDisablet(false)
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
    });
  };

  const handleLoadmore = () => {
    setPage(page + 1);
    filterSearch({ router, page: page + 1 });
    console.log(router);
  };

  return (
    <div className="home_page">
      <Head>
        <title>Home Page</title>
      </Head>
<Filter state= {state}/>
      {auth.user && auth.user.role === 'admin' && (
        <div
          className={!isDisablet? "delete_all btn btn-danger mt-2": "delete_all_change"}
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
            disabled={isDisablet}
            
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
      {props.result < page * 3 ? (
        ''
      ) : (
        <button
          className="btn btn-outline-info d-block mx-auto mb-4"
          onClick={handleLoadmore}
        >
          Load more
        </button>
      )}
    </div>
  );
};
export default Home;

export async function getServerSideProps({ query }) {
  const page = query.page || 1;
  const category = query.category || 'all';
  const sort = query.sort || '';
  const search = query.search || 'all';

  const res = await getData(
    `product?limit=${
      page * 3
    }&category=${category}&sort=${sort}&title=${search}`
  );
  //console.log(res);
  // server side rendering

  return {
    props: {
      products: res.products,
      result: res.result,
    }, // will be passed to the page component as props
  };
}

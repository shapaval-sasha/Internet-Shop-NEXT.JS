import Link from 'next/link';
import {decrease, increase}from '../store/Actions'

export default function CartItem( {item, dispatch, cart }) {
  return (
    <tr>
      <td >
        <img src={item.images[0].url} alt={item.images[0].url} style={{width:'120px'}}/>
      </td>
      <td >
        <h5>
          <Link href={`/product/${item._id}`}>
            <a>{item.title}</a>
          </Link>
        </h5>

        <h6 className='text-danger'>
         ${item.quantity * item.price}
        </h6>
        {
            item.inStock >0
            ? <p className="mb-1 text-danger">In Stock: {item.inStock}</p>
            : <p className="mb-1 text-danger"> Out Stock</p>
          }
      </td>
      <td className='align-middle' style={{minWidth:'150px'}}>
<button className="btn btn-outline-secondary" onClick={()=>dispatch(decrease(cart, item._id))} disabled={item.quantity===1?true:false}>-</button>
<span className='px-2'>{item.quantity}</span>
<button className="btn btn-outline-secondary" onClick={()=>dispatch(increase(cart, item._id))}  disabled={item.quantity===item.inStock?true:false}>+</button>
      </td>
      <td className='align-middle' style={{cursor:'pointer'}}>
        <i className="far fa-trash-alt text-danger" aris-hidden='true' data-toggle="modal" data-target="#exampleModal"
        onClick={()=> dispatch({
          type: 'ADD_MODAL',
          payload: {data:cart, id: item._id, title:item.title, type:'ADD_CART'}
        })}
        ></i>
      
      </td>
    </tr>
  );
}

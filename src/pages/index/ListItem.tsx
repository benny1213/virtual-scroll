import moment from 'moment';
import { DataStruct } from './interface';

interface ListItemProps {
  data: DataStruct
}

const ListItem = (props: ListItemProps) => {
  const { data } = props;
  return (
    <div className='list-item' key={data.id}>
      <div className='avatar' style={{backgroundColor: data.color}}>
        {data.name.slice(1)[0].toUpperCase()}
      </div>
      <div className='right'>
        <div className='name'>{data.name}</div>
        <div className='content'>{data.content}</div>
        <div className='date'>{moment(data.time).format('YYYY-MM-DD hh:mm:ss')}</div>
      </div>
    </div>
  )
}

export default ListItem;
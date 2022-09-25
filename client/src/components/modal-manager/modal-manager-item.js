import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'

function ManagerModalItem({ idx, item, data, setData }) {
    const [pushItemStyle, setPushItemStyle] = useState(false)

    const handlePush = (item) => {
        if (!pushItemStyle) {
            setData([...data, item])
        } else {
            const Items = data.filter(e => e !== item)
            setData(Items)
        }
        setPushItemStyle(!pushItemStyle)
    }

    return (
        <li className={pushItemStyle ? 'manager-list-item active' : 'manager-list-item'} onClick={() => handlePush(item._id)}>
            <div className='manager-index'>{idx + 1}</div>
            <Row className="manager-info">
                <Col className='span' sm={6} md={2}>{item.firstName}</Col>
                <Col className='span' sm={6} md={2}>{item.lastName}</Col>
                <Col className='span' sm={6} md={2}>{item.phone}</Col>
                <Col className='span' sm={6} md={2}>{item.login}</Col>
            </Row>
        </li>
    )
}

export default ManagerModalItem
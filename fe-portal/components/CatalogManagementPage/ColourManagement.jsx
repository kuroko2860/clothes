import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from "sweetalert2";

import Heading from '../Heading'
import { swtoast } from '@/mixins/swal.mixin'
import { homeAPI } from '@/config'

// const fakeColourList = [
//     { colour_id: 1, colour_name: "Trắng" },
//     { colour_id: 1, colour_name: "Đen" },
//     { colour_id: 1, colour_name: "Xanh" },
// ]

const ColourManage = () => {
    const [colourList, setColourList] = useState([])

    useEffect(() => {
        const getColourList = async () => {
            try {
                const result = await axios.get(`${homeAPI}/colour/list`)
                setColourList(result.data)
            } catch (err) {
                console.log(err)
                // setColourList(fakeColourList)
            }
        }
        getColourList()
    }, [])

    const refreshColourTable = async () => {
        try {
            const result = await axios.get(`${homeAPI}/colour/list`)
            setColourList(result.data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleCreateColour = async () => {
        const { value: newColour } = await Swal.fire({
            title: 'Nhập tên màu mới',
            input: 'text',
            inputLabel: '',
            inputPlaceholder: 'Tên màu mới..',
            showCloseButton: true,
        })
        if (!newColour) {
            swtoast.fire({
                text: "Thêm màu mới không thành công!"
            })
            return
        }
        if (newColour) {
            try {
                await axios.post(homeAPI + '/colour/create',
                    {
                        colour_name: newColour
                    })
                refreshColourTable()
                swtoast.success({
                    text: 'Thêm màu mới thành công!'
                })
            } catch (e) {
                console.log(e)
                swtoast.error({
                    text: 'Xảy ra lỗi khi thêm màu mới vui lòng thử lại!'
                })
            }
        }
    }

    const handleDeleteColour = async (colour) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa',
            text: `Bạn có chắc chắn muốn xóa màu "${colour.colour_name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${homeAPI}/colour/delete/${colour.colour_id}`);
                
                refreshColourTable();
                swtoast.success({
                    text: 'Xóa màu thành công!'
                });
            } catch (error) {
                console.log(error);
                swtoast.error({
                    text: 'Xảy ra lỗi khi xóa màu, vui lòng thử lại!'
                });
            }
        }
    }

    return (
        <div className="catalog-management-item">
            <Heading title="Tất cả màu" />
            <div className='create-btn-container'>
                <button className='btn btn-dark btn-sm' onClick={handleCreateColour}>Tạo màu</button>
            </div>
            <div className='table-container' style={{ height: "220px" }}>
                <table className='table table-hover table-bordered'>
                    <thead>
                        <tr>
                            <th className='text-center'>STT</th>
                            <th>Tên màu</th>
                            <th className='text-center'>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            colourList.map((colour, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='text-center'>{index + 1}</td>
                                        <td>{colour.colour_name}</td>
                                        <td className='text-center'>
                                            <button 
                                                className='btn btn-danger btn-sm'
                                                onClick={() => handleDeleteColour(colour)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ColourManage
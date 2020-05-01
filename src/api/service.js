import axios from 'axios'
import qs from 'qs'

//延时设置
axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.params = {}
// POST传参序列化
axios.interceptors.request.use((config) => {
    // if (config.method === 'post') {
    //     config.data = qs.stringify(config.data)
    // }
    let URL = config.url.split(config.baseURL)
    return config
}, (error) => {
    return Promise.reject(error)
})
  
// 返回状态判断
axios.interceptors.response.use((res) => {
    //console.log(res)
    return res
}, (error) => {
    return Promise.reject(error)
})


//封装获取数据
export const oGet = (url, params) => {
    return new Promise((resolve, reject) => {
        axios.get(url, params)
            .then(res => {
                resolve(res.data)
            }, err => {
                reject(err)
            }).catch(err => {
                reject(err)
            })
    })
};
//封装发送数据
export const oPost = (url, params) => {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(res => {
                resolve(res.data)
            }, err => {
                reject(err)
            }).catch(err => {
                reject(err)
            })
    })
}

//封装更新数据
export const oUpdate = (url ,param) => {
    return new Promise((resolve , reject) => {
        axios.put(url ,param)
            .then(res => {
                resolve(res.data)
            }, err => {
                reject(err)
            }).catch(err => {
                reject(err)
            })
    })
}

//封装删除数据
export const oRemove = (url , params) => {
    return new Promise((resolve,reject) => {
        axios.delete(url,params)
            .then(res => {
                resolve(res.data)
            },err => {
                reject(err)
            }).catch(err => {
                reject(err)
            })
    })
}

export default { 
// 127.0.0.1:5000
// 47.111.234.116:8080
    _getM () {
        return oGet('http://127.0.0.1:5000/api/u/member');
    },
    _getOM (id) {
        return oGet('http://127.0.0.1:5000/api/u/member/'+ id);
    },
    _getC () {
        return oGet('http://127.0.0.1:5000/api/u/course');
    },

    _getOC (id) {
        return oGet('http://127.0.0.1:5000/api/u/course/'+ id);
    },
    _getA (id) {
        return oGet('http://127.0.0.1:5000/api/u/activity/'+ id);
    },
    
    _post (params) {
        return oPost('http://127.0.0.1:5000/api/u/activity',params);
    },
    
    _update (id, param) {
        return oUpdate('http://127.0.0.1:5000/api/u/activity/state/'+ id, param);
    },

    _remove(coursename,memberid){      
        return oRemove('http://127.0.0.1:5000/api/u/activity/'+ coursename+'/'+memberid);
        
    },

    // //批量删除
    // _removes(){
    //     var ids = [];
    //     $.each(this.selected, (i, user) => {
    //         ids.push(user.id);
    //     });
    //     ids = ids.join(",");
    //     return oRemove('http://47.111.234.116:8080/rest/anon/tasks/'+ids);
    // },
}


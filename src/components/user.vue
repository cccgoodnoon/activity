<template>
    <!-- <el-container> -->
        <div id="user"> 
            <h1>教学任务分配</h1>
            <!-- <el-divider></el-divider> -->
            <div>            
                <ul class="btn-edit fr">
                    <li >
                        <el-date-picker
                            v-model="value"
                            align="right"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerOptions">
                        </el-date-picker>  
                        <el-button type="primary" @click="dialogCreateVisible = true"> <i class="el-icon-plus iconss" ></i>新增</el-button>
                        <el-button type="danger" icon="delete" :disabled="selected.length==0" @click="removeUsers()">移除</el-button>
                    </li>
                </ul>                
            </div>
            
            <el-row :gutter="24" class="row">
                <el-col :offset="1" :span="7">
                <!--左边表格-->
                    <div class="grid-content bg-purple">
                        <span>教师名单</span>
                        <el-table :data="member" height="650" ref="memberTable" @row-click="handleMember" @selection-change="memberTableSelection" highlight-current-row>
                            <el-table-column type="selection" width="55" :max="1"></el-table-column>
                            <el-table-column prop="id" label="ID" width="80"></el-table-column>
                            <el-table-column prop="employeeid" label="工号"></el-table-column>
                            <el-table-column prop="firstname" label="姓名"></el-table-column>
                        </el-table>         
                    </div>
                </el-col>

                <el-col  :span="7" >
                <!--中间表格-->
                    <div>
                        <span>课程清单</span>
                        <el-table  height="650" :data="course" ref="courseTable" @row-click="handleCourse" highlight-current-row>
                            <el-table-column type="selection" width="50"></el-table-column>
                            <el-table-column prop="id" label="ID" width="65"></el-table-column>
                            <el-table-column prop="code" label="课程代号" width="95"></el-table-column>
                            <el-table-column prop="name" label="课程名称"></el-table-column>
                        </el-table>
                    </div>
                </el-col>

                <el-col :span="7" >
                <!--右边表格-->
                    <div class="grid-content bg-purple-light">
                        <span id="teacher"></span><span>老师上课清单</span>
                        <el-table  height="650" :data="activity" row-class-name="rowBg">
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column prop="vesselNameCn" label="ID" width="80"></el-table-column>
                            <el-table-column prop="mmsi" label="MMSI"></el-table-column>
                            <el-table-column prop="equipmentCode" label="设备编码"></el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>   
            
            <!-- <div style="margin-top: 20px">
                <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
                <el-button @click="toggleSelection()">取消选择</el-button>
            </div> -->
        </div> 
    <!-- </el-container> -->
</template>

<script>
    import {
        mapState,
        mapMutations,
        mapGetters,
        mapActions
    } from 'vuex';
    import api from '../api/service.js'
    export default {
        name:'',
        data : function () {
            return{
                member:[],
                course:[],
                activity:[],
                checked: null,
                value: '',
                filter: {
                    per_page: 10, // 页大小
                    page: 1, // 当前页
                    id: '',
                    description: '',
                    endtime: '',
                    performer: '',
                    state: '',
                    title: '',
                    sorts: '',
                },
                // total_rows:0,
                selected: [], //已选择项
                dialogCreateVisible: false, //创建对话框的显示状态
                dialogUpdateVisible: false, //编辑对话框的显示状态
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                        picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                        }
                    },{
                        text: '一个月前',
                        onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', date);
                        }
                    }]
                },                
            }
        },
        mounted:function(){
            this.getMember();
            this.getCourse();
        },
        methods:{
            reset() {
                this.$refs.create.resetFields();
            },
            memberTableSelection(val) {
                if (val.length > 1) {
                    this.$refs.memberTable.clearSelection();
                    let array=val.pop();
                    this.$refs.memberTable.toggleRowSelection(array,true);
                    this.selected=array;
                    // console.log(array);
                    document.getElementById("teacher").innerHTML=array.firstname; 
                } 
                if (val.length == 1) {
                    this.$refs.memberTable.toggleRowSelection(val,false);
                    this.selected=val;
                    console.log(val);
                    document.getElementById("teacher").innerHTML=val.firstname;
                } 
            },     
            // tableSelectionChange(val) {
            //     this.selected=val;        
            // },             
            handleMember(row, event, column) {
                console.log(row, event, column)
                console.log(row.firstname);
                this.$refs.memberTable.toggleRowSelection(row);
                document.getElementById("teacher").innerHTML=row.firstname; 
            },
            handleCourse(row, event, column) {
                console.log(row, event, column)
                this.$refs.courseTable.toggleRowSelection(row).then(res => {
                    api._getC().then(res => {
                        console.log(row.id);
                        var course_uuid = res[row.id].uuid;
                    })
                })
                console.log("234");
            },
            //获取任务数据
            getMember(){
                let self = this
                api._getM().then(res => {
                    self.member = res;
                    // console.log(res.data);
                    // this.total_rows = res.datas.total_rows;
                    // console.log(res,8888);
                },err => {
                    console.log(err);
                })
            },
            getCourse(){
                let self = this
                api._getC().then(res => {
                    self.course = res;
                    console.log(res);
                    // this.total_rows = res.datas.total_rows;
                    // console.log(res,8888);
                },err => {
                    console.log(err);
                })
            },
            //创建任务
            createUser() {
                this.$refs.create.validate((valid) => {
                    if (valid) {
                        api._post(this.create).then(res => {
                            this.$message.success('创建任务成功！');
                            this.dialogCreateVisible = false;
                            this.createLoading = false;
                            this.reset();
                            this.getUsers();
                        }).catch((res) => {
                            var data = res;
                            if (data instanceof Array) {
                              this.$message.error(data[0]["message"]);
                            } else if (data instanceof Object) {
                              this.$message.error(data["message"]);
                            }
                            this.createLoading = false;
                        });
                    } else {
                      //this.$message.error('存在输入校验错误!');
                      return false;
                    }
                });
            },
            
            // 更新任务
            updateUser() {
                this.$refs.update.validate((valid) => {
                    if (valid) {
                        api._update(this.currentId, this.update).then(res => {
                            this.$message.success('修改任务成功！');
                            this.dialogUpdateVisible = false;
                            this.getUsers();
                        }).catch((res) => {
                            var data = res;
                            if (data instanceof Array) {
                                this.$message.error(data[0]["message"]);
                            } else if (data instanceof Object) {
                                this.$message.error(data["message"]);
                            }
                            this.updateLoading = false;
                          });
                    } else {
                        return false;
                    }
                });
            },

            // 删除单个任务
            removeUser(user) {
                this.$confirm('是否要删除任务 ' + user.title + ' ?', '提示', {
                  type: 'warning'
                }).then(() => {
                    api._remove(user).then(res => {
                        this.$message.success('成功删除了任务' + user.title + ' !');
                        this.getUsers();
                        console.log(user.id);
                    }).catch((res) => {
                        this.$message.error('删除失败!');
                    });
                }).catch(() => {
                    this.$message.info('已取消操作!');
                });
            },

             //删除多个任务
            removeUsers() {
                this.$confirm('此操作将永久删除 ' + this.selected.length + ' 个任务, 是否继续?', '提示', {
                    type: 'warning'
                }).then(() => {
                    api._removes().then(res =>{
                        this.$message.success('删除了' + this.selected.length + '个任务!');
                        this.getUsers();
                    }).catch((res) => {
                        this.$message.error('删除失败!');
                    });
                }).catch(() => {
                    this.$message('已取消操作!');
                });
            }
        }
    }
</script>
<style>
.row{
    margin-top: 50px;
    text-align:left;
}
ul li{list-style: none}
.tc{text-align:center; }
.mg{ margin-top:1px;}
.fl{float:left;}
.fr{float:right;margin: 0px 120px}
h1{text-align: center; margin-bottom: 0px }
</style>
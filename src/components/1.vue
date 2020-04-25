<el-container>
        <el-main>
            <div id="user"> 
                <h1>TODO</h1>
                <el-row class="line-display">
                    <el-col :span="22" :offset="1">
                        <div class="grid-content" style="margin-top:0px; border:0">
                            <!-- 操作 -->
                            <ul class="btn-edit fr">
                                <li >
                                    <el-button type="primary" @click="dialogCreateVisible = true"> <i class="el-icon-plus iconss" ></i>新增任务</el-button>
                                    <el-button type="danger" icon="delete" :disabled="selected.length==0" @click="removeUsers()"  >删除</el-button>
                                </li>
                            </ul>

                            <!-- 用户列表-->
                            <el-col :span="24" style="height:20px;"></el-col>
                            <el-table :data="users"                            
                                    height="600"
                                    @selection-change="tableSelectionChange" >
                                <el-table-column type="selection"
                                                width="100">
                                </el-table-column>
                                <el-table-column prop="id"
                                                label="任务ID"
                                                width="120">
                                </el-table-column>
                                <el-table-column prop="title"
                                                label="任务说明"
                                                width="280">
                                </el-table-column>
                                <el-table-column prop="performer"
                                                label="负责人"
                                                width="178">
                                </el-table-column>                        
                                <el-table-column prop="endtime"
                                                label="截止日期"
                                                width="240">
                                </el-table-column>                       
                                <el-table-column prop="state"
                                                label="完成状态"
                                                width="160">
                                                <!-- <template slot-scope="scope">
                                                    <el-tag
                                                    :type="scope.row.state === '家' ? 'primary' : 'success'"
                                                    disable-transitions>{{scope.row.stete}}</el-tag>
                                                </template> -->
                                </el-table-column>
                                <el-table-column
                                    inline-template
                                    label="操作"
                                    width="210">
                                    <span>
                                        <el-button type="danger" size="small" @click="removeUser(row)">删除</el-button>
                                        <el-button type="success" size="small" @click="setCurrent(row)">编辑</el-button>
                                    </span>
                                </el-table-column>
                            </el-table>
                            <div style="width:100%; ovflow:hidden; height:180px;"></div>
                        </div>
                    </el-col>
                </el-row>

                <!-- 新建任务 begin-->
                <el-dialog title="新建任务" v-model="dialogCreateVisible" :close-on-click-modal="false" :close-on-press-escape="false" @close="reset" >
                    <el-form id="#create" :model="create" :rules="rules" ref="create" label-width="100px">
                        <el-form-item label="负责人" prop="performer">
                            <el-input v-model="create.performer"></el-input>
                        </el-form-item>
                        <el-form-item label="任务说明" prop="title">
                            <el-input v-model="create.title"></el-input>
                        </el-form-item>
                        <el-form-item label="任务详情" prop="description">
                            <el-input type="textarea" v-model="create.description"></el-input>
                        </el-form-item>
                        <el-form-item label="开始日期">
                            <el-date-picker v-model="create.begintime" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="截止日期">
                            <el-date-picker v-model="create.endtime" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <!-- <el-form-item label="完成">
                            <el-switch on-text="" off-text="" v-model="create.state"></el-switch>
                        </el-form-item> -->
                        <el-form-item label="是否完成" prop="state">
                            <el-select v-model="create.state" placeholder="请选择完成情况">
                                <el-option label="未完成" value="未完成"></el-option>
                                <el-option label="已完成" value="已完成"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogCreateVisible = false">取 消</el-button>
                        <el-button type="primary" :loading="createLoading" @click="createUser">确 定</el-button>
                    </div>
                </el-dialog>
                <!-- 修改用户 begin-->
                <el-dialog title="修改用户信息" v-model="dialogUpdateVisible"  :close-on-click-modal="false" :close-on-press-escape="false">
                    <el-form id="#update" :model="update" :rules="updateRules" ref="update" label-width="100px">
                        <!-- <el-form-item label="任务ID" prop="id">
                            <el-input v-model="update.id"></el-input>
                        </el-form-item> -->
                        <el-form-item label="负责人" prop="performer">
                            <el-input v-model="update.performer"></el-input>
                        </el-form-item>
                        <el-form-item label="任务说明" prop="title">
                            <el-input v-model="update.title"></el-input>
                        </el-form-item>
                        <el-form-item label="任务详情" prop="description">
                            <el-input type="textarea" v-model="update.description"></el-input>
                        </el-form-item>
                        <el-form-item label="开始日期">
                            <el-date-picker v-model="update.begintime" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="截止日期">
                            <el-date-picker v-model="update.endtime" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <!-- <el-form-item label="是否完成">
                            <el-switch on-text="" off-text="" v-model="update.state"></el-switch>
                        </el-form-item> -->
                        <el-form-item label="是否完成">
                            <el-select v-model="update.state" prop="state">
                                <el-option label="已完成" value="已完成"></el-option>
                                <el-option label="未完成" value="未完成"></el-option>
                            </el-select>
                        </el-form-item> 
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogUpdateVisible = false">取 消</el-button>
                        <el-button type="primary" :loading="updateLoading" @click="updateUser">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </el-main>
    </el-container>

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
                create: {
                    description: '',
                    begintime: '',
                    endtime: '',
                    performer: '',
                    title: '',
                    state: '',
                },
                currentId: '',
                update: {
                    description: '',
                    begintime: '',
                    endtime: '',
                    performer: '',
                    state: '',
                    title: '',
                    state: ''
                },
                rules: {
                    performer: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    }, {
                        min: 2,
                        max: 15,
                        message: '长度在 2 到 15 个字符'
                    }],
                    title: [{
                        required: true,
                        message: '请输入任务名',
                        trigger: 'blur'
                    }, {
                        min: 1,
                        max: 25,
                        // message: '长度在 6 到 25 个字符'
                    }],
                },
                updateRules: {
                    performer: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    }, {
                        min: 2,
                        max: 15,
                        message: '长度在 2 到 15 个字符'
                    }],
                    title: [{
                        required: true,
                        message: '请输入任务名',
                        trigger: 'blur'
                    }, {
                        min: 1,
                        max: 25,
                        // message: '长度在 6 到 25 个字符'
                    }],
                },
                total_rows:0,
                selected: [], //已选择项
                dialogCreateVisible: false, //创建对话框的显示状态
                dialogUpdateVisible: false, //编辑对话框的显示状态
            }
        },
        mounted:function(){
            this.getUsers();
        },
        methods:{
            tableSelectionChange(val) {
                this.selected = val;
            },
            //每页显示多少条
            pageSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.filter.per_page = val;
                this.getUsers();
            },
            //当前页选择
            pageCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.filter.page = val;
                this.getUsers();
            },
            rowClick(row, event) {
                var index = $.inArray(row, this.selected)
                if (index < 0) {
                    this.selected.push(row);
                    this.$refs.usersTable.toggleRowSelection(row, true);
                } else {
                    this.selected.splice(index, 1);
                    this.$refs.usersTable.toggleRowSelection(row, false);
                }
            },
           // 重置表单
            reset() {
                this.$refs.create.resetFields();
            },

            //编辑
            setCurrent(user) {
                this.currentId = user.id;
                this.update.performer = user.performer;
                this.update.title = user.title;
                this.update.description = user.description;
                this.update.begintime = user.begintime;
                this.update.endtime = user.endtime;
                this.update.state = user.state;
                this.dialogUpdateVisible = true;
            },
            //获取任务数据
            getUsers(){
                let self = this
                api._get().then(res => {
                    self.users = res;
                    console.log(res.data);
                    this.total_rows = res.datas.total_rows;
                    console.log(res,8888);
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
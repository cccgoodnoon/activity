<template>
    <!-- <el-container> -->
        <div id="user"> 
            <h1>教学任务分配</h1>
            <!-- <el-divider></el-divider> -->
            <div>            
                <ul class="fr">
                    <li >
                        <el-date-picker
                            v-model="timeValue"
                            align="right"
                            type="date"
                            placeholder="选择课程开始日期"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            :picker-options="pickerOptions">
                        </el-date-picker>  
                        <el-button type="primary" @click="addActivity()"> <i class="el-icon-plus iconss" ></i>新增</el-button>
                        <el-button type="danger" icon="delete" :disabled="actiSelected.length==0" @click="removeActivity()">移除</el-button>
                    </li>
                </ul>                
            </div>
            
            <el-row :gutter="24" class="row">
                <el-col :offset="1" :span="7">
                <!--左边表格-->
                    <div>
                        <span class="subtitle">教师名单</span>
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
                        <span class="subtitle">课程清单</span>
                        <el-table  height="650" :data="course" ref="courseTable" @row-click="handleCourse" @selection-change="courseTableSelection" highlight-current-row>
                            <el-table-column type="selection" width="50"></el-table-column>
                            <el-table-column prop="id" label="ID" width="65"></el-table-column>
                            <el-table-column prop="code" label="课程代号" width="95"></el-table-column>
                            <el-table-column prop="name" label="课程名称"></el-table-column>
                        </el-table>
                    </div>
                </el-col>

                <el-col :span="7" >
                <!--右边表格-->
                    <div class="righttable">
                        <!-- <div><span id="teacher"></span><span>老师上课清单</span></div> -->
                        <el-table  height="650" :data="activity" ref="activityTable" @selection-change="actiTableSelection">
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column prop="id" label="ID" width="65">
                                <template slot-scope="scope">{{scope.$index +1}}</template>
                            </el-table-column>
                            <el-table-column prop="code" label="课程代号" width="95"></el-table-column>
                            <el-table-column prop="name" label="课程名称"></el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>   
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
        data() {
            return{
                member:[],
                course:[],
                activity:[],
                checked: null,
                timeValue: '',
                course_uuid:'',
                course_credit:'',
                member_uuid:'',
                selected: [],
                courseSelected: [],
                actiSelected: [], 
                course_name:'',
                pickerOptions: {
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
            actiTableSelection(val) {
                if (val.length == 1) {
                    this.$refs.activityTable.toggleRowSelection(val,false);
                    this.actiSelected=val;
                    this.course_name = val[0].name;
                }
                if (val.length > 1) {
                    this.$refs.activityTable.clearSelection();
                    let array=val.pop();
                    this.$refs.activityTable.toggleRowSelection(array,true);
                    this.actiSelected=array;
                    // document.getElementById("teacher").innerHTML=array.firstname; 
                }  
            },
            memberTableSelection(val) {
                if (val.length > 1) {
                    this.$refs.memberTable.clearSelection();
                    let array=val.pop();
                    this.$refs.memberTable.toggleRowSelection(array,true);
                    this.selected=array;
                    // document.getElementById("teacher").innerHTML=array.firstname; 
                } 
                if (val.length == 1) {
                    this.$refs.memberTable.toggleRowSelection(val,false);
                    this.selected=val;
                    // document.getElementById("teacher").innerHTML=val.firstname;
                } 
            },
            courseTableSelection(val) {
                if (val.length > 1) {
                    this.$refs.courseTable.clearSelection();
                    let array=val.pop();
                    this.$refs.courseTable.toggleRowSelection(array,true);
                    this.courseSelected=array;
                    // document.getElementById("teacher").innerHTML=array.firstname; 
                } 
                if (val.length == 1) {
                    this.$refs.memberTable.toggleRowSelection(val,false);
                    this.courseSelected=val;
                    // document.getElementById("teacher").innerHTML=val.firstname;
                } 
            },             
            handleMember(row, event, column) {
                console.log(row.firstname);
                this.$refs.memberTable.toggleRowSelection(row);
                // document.getElementById("teacher").innerHTML=row.firstname; 
                api._getM().then(res => {
                    this.member_uuid = res[row.id-1].uuid;
                    console.log(this.member_uuid);
                    this.getActivity(this.member_uuid);
                })           
            },
            handleCourse(row, event, column) {
                this.$refs.courseTable.toggleRowSelection(row)
                api._getC().then(res => {
                    this.course_uuid = res[row.id-3].uuid;
                    this.course_credit = res[row.id-3].credit;
                    console.log(res[row.id-3]);
                    console.log(this.course_uuid);
                    console.log(this.course_credit);
                })
            },
            getMember(){
                let self = this
                api._getM().then(res => {
                    console.log(res);
                    self.member = res;
                },err => {
                    console.log(err);
                })
            },
            getCourse(){
                let self = this
                api._getC().then(res => {
                    self.course = res;
                },err => {
                    console.log(err);
                })
            },
            getActivity(id){
                let self = this
                api._getA(this.member_uuid).then(res =>{
                    console.log(res);
                    self.activity = res;
                },err => {
                    console.log(err);
                })
            },
            addActivity(){
                if(this.course_uuid != ''&&this.member_uuid != ''&&this.timeValue != ''){
                    api._post({course_uuid:this.course_uuid,course_credit:this.course_credit,member_uuid:this.member_uuid,timeValue:this.timeValue}).then(res =>{
                        this.$message.success('成功为该老师添加一门课！');
                        // this.getMember();
                        this.getCourse();
                        this.getActivity();
                        this.timeValue = '';
                    },err => {
                        console.log(err);
                    })                    
                } else if (this.member_uuid == '') {
                    this.$message.warning('请选择一位老师!');
                } else if (this.course_uuid == '') {
                    this.$message.warning('请选择一门课!');
                } else if (this.timeValue == '') {
                    this.$message.warning('请选择课程开始时间!');
                }
                console.log(this.course_uuid);
                console.log(this.course_credit);
                console.log(this.member_uuid);
                console.log(this.timeValue);                               
            },
            removeActivity(){
                console.log(this.course_name);
                console.log(this.member_uuid);
                this.$confirm('此操作将删除该老师的 ' + this.actiSelected.length + ' 门课程, 是否继续?','提示', {
                  type: 'warning'
                }).then(() => {
                    api._remove(this.course_name,this.member_uuid).then(res => {
                        this.$message.success('成功删除了课程!');
                        // this.getMember();
                        // this.getCourse();
                        this.getActivity();
                    }).catch((res) => {
                        this.$message.error('删除失败!');
                    });
                }).catch(() => {
                    this.$message.info('已取消操作!');
                });
            },
        }
    }
</script>
<style>
.row{
    margin-top: 50px;
    text-align:left;
}
.subtitle{
    color:#409EFF;
    font-size: 16px;
    padding: 5px;
    display:block;
}
.righttable{margin-top: 30px;}
ul li{list-style: none}
.tc{text-align:center; }
.mg{ margin-top:1px;}
.fl{float:left;}
.fr{float:right;margin: 0px 120px 0px 10px}
h1{text-align: center; margin-bottom: 0px;color: #112d4e;letter-spacing:5px;}
</style>
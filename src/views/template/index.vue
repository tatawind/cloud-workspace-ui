<template>
	<div class="system-menu-container layout-pd">
		<el-card shadow="hover">
			<div class="system-menu-search mb15">
				<el-input size="default" placeholder="请输入工作空间名称" style="max-width: 180px"> </el-input>
				<el-button size="default" type="primary" class="ml10" @click="queryWorkspace()">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
			</div>
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%" row-key="uuid"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
				<el-table-column label="序号" show-overflow-tooltip width="80">
					<template #default="scope">
						{{ scope.$index }}
					</template>
				</el-table-column>
				<el-table-column prop="uuid" label="工作空间ID" show-overflow-tooltip></el-table-column>
				<el-table-column label="模板名称" show-overflow-tooltip>
					<template #default="scope">
						<span class="ml10">{{ $t(scope.row.name) }}</span>
					</template>
				</el-table-column>
				<el-table-column label="描述信息" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ scope.row.info }}</span>
					</template>
				</el-table-column>
				<el-table-column label="镜像信息" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ scope.row.image.name }}:{{ scope.row.image.version }}</span>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ scope.row.createTime }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" show-overflow-tooltip width="200">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onCreateWorksapce(scope.row)">创建空间</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="workspace">
import { onActivated, reactive } from 'vue'
import { workspaceQuery, workspaceMutation } from '/@/api/apollo/workspace'
import gql from 'graphql-tag'
import { ElMessageBox, ElMessage } from 'element-plus';
import router from "/@/router";

// 定义变量内容
const state = reactive({
	tableData: {
		data: [] as any[],
		loading: true,
	},
});

// 获取路由数据，真实请从接口获取
const queryWorkspace = () => {

	state.tableData.loading = true;

	workspaceQuery(gql`
      query WorksapceTemplate {
        systemTemplates {
			uuid,
			name,
			info,
			createTime,
			image {
				uuid,
				name,
				version
			}
    	}
      }
    `, null,
		{
			fetchPolicy: "no-cache"
		})
		.onResult(e => {
			state.tableData.data = e?.data?.systemTemplates;

			setTimeout(() => {
				state.tableData.loading = false;
			}, 500);
		});


};


const createWorkspace = () => {
	state.tableData.loading = true;

	const { mutate: WorksapceCreate, onDone } = workspaceMutation(gql`
		mutation WorksapceCreate($req: WorkspaceInput) {
			workspace_create(workspaceInput: $req) {
				uuid
				name
				ownerId        
			}
		}
		`,
		{
			fetchPolicy: "no-cache"
		});

	return {
		WorksapceCreate,
		onDone
	}
};

const onCreateWorksapce = (row: RowRoleType) => {
	ElMessageBox.confirm(`将使用模板“${row.name}”创建工作空间，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			let cw = createWorkspace();

			cw.WorksapceCreate({
				req: {
					name: "我是空间",
					info: "这个是一个测试空间",
					templateId: row.uuid,
					userId: "likewind"
				}
			});
			cw.onDone(e => {
				setTimeout(() => {
					state.tableData.loading = false;
					router.push({
						path: '/workspace'
					})
				}, 500);
			})
		})
		.catch(() => { });
};

// 页面加载时
onActivated(() => {
	queryWorkspace();
});
</script>

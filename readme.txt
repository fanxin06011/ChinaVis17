控制台输入
$("#problem1btn").click()
$("#problem2btn").click()
$("#problem3btn").click()
来切换模式
mode-1 问题一 未成年人上网
mode-2 问题二 流动人口（籍贯） 热力图
mode-3 问题三 青年犯罪团伙 高亮


代码写在/*code here*/的地方
响应写在onMessage函数里
发出事件用Observer.fireEvent("event_name",dataSend,viewname);


冯柱天
popview.js
div id:p4_pop

粟锐
popuchara.js
div id:right_view (china_map province_line)

罗文杰
crime.js
div id:bottom_view


barmap中间地图
发出事件：
单击：bar_selected
单击取消：bar_selected_cancel
双击(mode!=1时)：bar_dblclicked
data都是网吧ID

对应mode下响应事件：
问题二流动人口，事件名："problem2"，数据格式为[
			{"name":50010210000086,"value":100},
			{"name":50024210000053,"value":50},
			{"name":50023010000004,"value":30},
			{"name":50023010000014,"value":40},
			{"name":50024210000060,"value":31},
			{"name":50022310000007,"value":7},
			{"name":50022710000024,"value":22}
			]
问题三青年犯罪团伙，事件名："problem3"，数据格式为网吧ID的数组



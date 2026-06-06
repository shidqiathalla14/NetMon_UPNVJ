TYPE=TRIGGERS
triggers='CREATE DEFINER=`zabbix`@`%` trigger proxy_group_insert after insert on proxy_group\nfor each row\ninsert into changelog (object,objectid,operation,clock)\nvalues (20,new.proxy_groupid,1,unix_timestamp())' 'CREATE DEFINER=`zabbix`@`%` trigger proxy_group_update after update on proxy_group\nfor each row\ninsert into changelog (object,objectid,operation,clock)\nvalues (20,old.proxy_groupid,2,unix_timestamp())' 'CREATE DEFINER=`zabbix`@`%` trigger proxy_group_delete before delete on proxy_group\nfor each row\ninsert into changelog (object,objectid,operation,clock)\nvalues (20,old.proxy_groupid,3,unix_timestamp())'
sql_modes=1411383296 1411383296 1411383296
definers='zabbix@%' 'zabbix@%' 'zabbix@%'
client_cs_names='utf8mb4' 'utf8mb4' 'utf8mb4'
connection_cl_names='utf8mb4_general_ci' 'utf8mb4_general_ci' 'utf8mb4_general_ci'
db_cl_names='utf8mb4_general_ci' 'utf8mb4_general_ci' 'utf8mb4_general_ci'
created=1780533638920019 1780533639131187 1780533639523997

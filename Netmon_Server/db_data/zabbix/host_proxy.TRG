TYPE=TRIGGERS
triggers='CREATE DEFINER=`zabbix`@`%` trigger host_proxy_insert after insert on host_proxy\nfor each row\ninsert into changelog (object,objectid,operation,clock)\nvalues (21,new.hostproxyid,1,unix_timestamp())' 'CREATE DEFINER=`zabbix`@`%` trigger host_proxy_update after update on host_proxy\nfor each row\ninsert into changelog (object,objectid,operation,clock)\nvalues (21,old.hostproxyid,2,unix_timestamp())' 'CREATE DEFINER=`zabbix`@`%` trigger host_proxy_delete before delete on host_proxy\nfor each row\ninsert into changelog (object,objectid,operation,clock)\nvalues (21,old.hostproxyid,3,unix_timestamp())'
sql_modes=1411383296 1411383296 1411383296
definers='zabbix@%' 'zabbix@%' 'zabbix@%'
client_cs_names='utf8mb4' 'utf8mb4' 'utf8mb4'
connection_cl_names='utf8mb4_general_ci' 'utf8mb4_general_ci' 'utf8mb4_general_ci'
db_cl_names='utf8mb4_general_ci' 'utf8mb4_general_ci' 'utf8mb4_general_ci'
created=1780533639861743 1780533639915061 1780533640034290

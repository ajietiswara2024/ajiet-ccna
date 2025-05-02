# 🧪 VLAN & Trunking Lab

### 🎯 Tujuan:
- Membuat beberapa VLAN (10, 20, 30)
- Assign port ke VLAN
- Konfigurasi trunking antara switch

### 🔧 Perangkat:
- 2 Switch
- 1 Router
- 3 PC

### 📜 Ringkasan CLI:
```bash
Switch(config)# vlan 10
Switch(config)# interface fa0/1
Switch(config-if)# switchport access vlan 10
Switch(config)# interface range fa0/24, gi0/1
Switch(config-if-range)# switchport mode trunk

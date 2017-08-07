CREATE DATABASE  IF NOT EXISTS `{{schema_name}}`;
USE `{{schema_name}}`;

--
-- Table structure for table `arcadr`
--
DROP TABLE IF EXISTS `arcadr`;
CREATE TABLE `arcadr` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `ccustno` varchar(4) DEFAULT NULL,
  `caddrno` varchar(10) DEFAULT NULL,
  `ccompany` varchar(33) DEFAULT NULL,
  `caddr1` varchar(22) DEFAULT NULL,
  `caddr2` varchar(7) DEFAULT NULL,
  `ccity` varchar(13) DEFAULT NULL,
  `cstate` varchar(2) DEFAULT NULL,
  `czip` int(11) DEFAULT NULL,
  `ccountry` varchar(3) DEFAULT NULL,
  `cphone` varchar(12) DEFAULT NULL,
  `ccontact` varchar(15) DEFAULT NULL,
  `ctaxcode` varchar(4) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

--
-- Table structure for table `arcard`
--
DROP TABLE IF EXISTS `arcard`;
CREATE TABLE `arcard` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `cuid` int(11) DEFAULT NULL,
  `ccustno` varchar(4) DEFAULT NULL,
  `cpaycode` varchar(9) DEFAULT NULL,
  `ccardno` varchar(19) DEFAULT NULL,
  `cexpdate` varchar(5) DEFAULT NULL,
  `ccardname` varchar(13) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

--
-- Table structure for table `arcust`
--
DROP TABLE IF EXISTS `arcust`;
CREATE TABLE `arcust` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `ccustno` varchar(10) DEFAULT NULL,
  `ccompany` varchar(30) DEFAULT NULL,
  `caddr1` varchar(20) DEFAULT NULL,
  `caddr2` varchar(7) DEFAULT NULL,
  `ccity` varchar(13) DEFAULT NULL,
  `cstate` varchar(2) DEFAULT NULL,
  `czip` int(11) DEFAULT NULL,
  `ccountry` varchar(3) DEFAULT NULL,
  `cphone1` varchar(12) DEFAULT NULL,
  `cphone2` varchar(12) DEFAULT NULL,
  `cfax` varchar(12) DEFAULT NULL,
  `cemail` varchar(21) DEFAULT NULL,
  `cfname` varchar(6) DEFAULT NULL,
  `clname` varchar(7) DEFAULT NULL,
  `cdear` varchar(6) DEFAULT NULL,
  `ctitle` varchar(13) DEFAULT NULL,
  `corderby` varchar(30) DEFAULT NULL,
  `cslpnno` varchar(6) DEFAULT NULL,
  `cstatus` varchar(1) DEFAULT NULL,
  `cclass` varchar(9) DEFAULT NULL,
  `cindustry` varchar(10) DEFAULT NULL,
  `cterr` varchar(1) DEFAULT NULL,
  `cwarehouse` varchar(4) DEFAULT NULL,
  `cpaycode` varchar(9) DEFAULT NULL,
  `cbilltono` varchar(4) DEFAULT NULL,
  `cshiptono` varchar(4) DEFAULT NULL,
  `ctaxcode` varchar(4) DEFAULT NULL,
  `crevncode` varchar(30) DEFAULT NULL,
  `cresaleno` varchar(11) DEFAULT NULL,
  `cpstno` varchar(30) DEFAULT NULL,
  `ccurrcode` varchar(3) DEFAULT NULL,
  `cprtstmt` varchar(1) DEFAULT NULL,
  `caracc` varchar(13) DEFAULT NULL,
  `crcalactn` varchar(30) DEFAULT NULL,
  `clcalactn` varchar(30) DEFAULT NULL,
  `cpasswd` varchar(30) DEFAULT NULL,
  `cecstatus` varchar(1) NOT NULL,
  `cecaddress` varchar(30) DEFAULT NULL,
  `cpricecd` int(11) DEFAULT NULL,
  `dcreate` varchar(19) NOT NULL,
  `tmodified` varchar(19) NOT NULL,
  `trecall` varchar(4) NOT NULL,
  `tlcall` varchar(4) NOT NULL,
  `lprtstmt` bit(1) NOT NULL,
  `lfinchg` bit(1) NOT NULL,
  `liocust` bit(1) NOT NULL,
  `lusecusitm` bit(1) NOT NULL,
  `lgeninvc` bit(1) NOT NULL,
  `luselprice` bit(1) NOT NULL,
  `nexpdays` bit(1) NOT NULL,
  `ndiscrate` decimal(5,2) NOT NULL,
  `natdsamt` decimal(7,2) NOT NULL,
  `ncrlimit` decimal(8,2) NOT NULL,
  `nsoboamt` decimal(6,2) NOT NULL,
  `nopencr` decimal(4,2) NOT NULL,
  `nbalance` decimal(7,2) NOT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

--
-- Table structure for table `arfob`
--
DROP TABLE IF EXISTS `arfob`;
CREATE TABLE `arfob` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `code` varchar(2) DEFAULT NULL,
  `description` varchar(20) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
INSERT INTO `arfob` (id, code, description) VALUES (1,'SD','SanDiego');

--
-- Table structure for table `arfrgt`
--
DROP TABLE IF EXISTS `arfrgt`;
CREATE TABLE `arfrgt` (
  `id` int(2) NOT NULL AUTO_INCREMENT,
  `description` varchar(50) DEFAULT NULL,
  `trevacc` int(5) DEFAULT '4410',
  `taxable1` int(2) DEFAULT '0',
  `taxable2` int(2) DEFAULT '0',
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
INSERT INTO `arfrgt` (id, description, trevacc, taxable1, taxable2) VALUES (1,'Ground',4410,0,0),(2,'Air',4410,0,0),(3,'Sea',4410,0,0),(4,'Next Day E/AM',4410,0,0),(5,'Next Day',4410,0,0),(6,'2nd Day',4410,0,0),(7,'LCLShipment',4410,0,0);

--
-- Table structure for table `arinvoice`
--
DROP TABLE IF EXISTS `arinvoice`;
CREATE TABLE `arinvoice` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) unsigned DEFAULT NULL,
  `cinvno` int(11) unsigned DEFAULT NULL,
  `cwarehouse` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sidemarkno` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sono` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `corderby` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cslpnno` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cshipvia` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cfob` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cpono` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dorder` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dinvoice` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remark` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nfsalesamt` double DEFAULT NULL,
  `nfdiscamt` double DEFAULT NULL,
  `nftaxamt1` double DEFAULT NULL,
  `nfbalance` double DEFAULT NULL,
  `nxchgrate` double DEFAULT NULL,
  `costax` int(11) unsigned DEFAULT NULL,
  `nbalance` decimal(10,2) DEFAULT NULL,
  `ccustno` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ccurrcode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ndiscamt` double DEFAULT NULL,
  `nfrtamt` int(11) unsigned DEFAULT NULL,
  `nadjamt` int(11) unsigned DEFAULT NULL,
  `cbcompany` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cbaddr1` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cbaddr2` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cbcity` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cbstate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cbzip` int(11) unsigned DEFAULT NULL,
  `cbcountry` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cbphone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cbcontact` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cscompany` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `csaddr1` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `csaddr2` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cscity` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `csstate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cszip` int(11) unsigned DEFAULT NULL,
  `cscountry` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `csphone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cscontact` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notepad` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;


--
-- Table structure for table `arirmk`
--
DROP TABLE IF EXISTS `arirmk`;
CREATE TABLE `arirmk` (
  `id` int(2) NOT NULL AUTO_INCREMENT,
  `code` varchar(20) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

--
-- Table structure for table `aritrs`
--
DROP TABLE IF EXISTS `aritrs`;
CREATE TABLE `aritrs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ccustno` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cwarehouse` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cinvno` int(11) unsigned DEFAULT NULL,
  `citemno` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cdescript` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ndiscrate` double DEFAULT NULL,
  `nordqty` double DEFAULT NULL,
  `nshipqty` double DEFAULT NULL,
  `nfprice` double DEFAULT NULL,
  `nfsalesamt` double DEFAULT NULL,
  `nfdiscamt` double DEFAULT NULL,
  `nsalesamt` decimal(10,2) DEFAULT NULL,
  `ndiscamt` decimal(10,2) DEFAULT NULL,
  `nprice` decimal(10,2) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

--
-- Table structure for table `arpycd`
--
DROP TABLE IF EXISTS `arpycd`;
CREATE TABLE `arpycd` (
  `id` int(2) NOT NULL AUTO_INCREMENT,
  `cpaycode` varchar(20) DEFAULT NULL,
  `cdescript` varchar(50) DEFAULT NULL,
  `cbankno` varchar(50) DEFAULT NULL,
  `lautoapp` int(5) DEFAULT NULL,
  `lfinchg` int(5) DEFAULT NULL,
  `npaytype` int(5) DEFAULT NULL,
  `ntermdisc` decimal(5,0) DEFAULT NULL,
  `ndiscday` int(5) DEFAULT NULL,
  `ndueday` int(5) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
INSERT INTO `arpycd` (id, cpaycode, cdescript, cbankno, lautoapp, lfinchg, npaytype, ntermdisc, ndiscday, ndueday) VALUES (7,'2%10NET30','2% 10 NET 30 DAYS','BOFA',0,1,5,2,10,30),(8,'C.O.D','Cash on Delivery','BOFA',0,1,4,0,0,0),(9,'CARD','Other Credit Card','BOFA2',0,1,3,0,0,0),(10,'CHECK','Check','BOFA3',0,1,2,0,0,0),(11,'IN-HOUSE','Items for In-House Use','BOFA',1,0,6,0,0,0),(12,'MASTERCARE','MasterCard','BOFA',1,1,3,0,0,0),(13,'NET0','Due Now','BOFA',0,1,6,0,0,0),(14,'VISA CARD','VISA Card','BOFA',1,1,3,0,0,0);

--
-- Table structure for table `arrevn`
--
DROP TABLE IF EXISTS `arrevn`;
CREATE TABLE `arrevn` (
  `id` int(2) NOT NULL AUTO_INCREMENT,
  `crevncode` varchar(5) DEFAULT NULL,
  `cdescript` varchar(50) DEFAULT NULL,
  `crevnacc` varchar(50) DEFAULT NULL,
  `crtrnacc` varchar(50) DEFAULT NULL,
  `cdiscacc` varchar(50) DEFAULT NULL,
  `ccogsacc` varchar(50) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
INSERT INTO `arrevn` (id, crevncode) VALUES (1,'CSO');

--
-- Table structure for table `arslpn`
--
DROP TABLE IF EXISTS `arslpn`;
CREATE TABLE `arslpn` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `cslpnno` varchar(2) DEFAULT NULL,
  `cname` varchar(15) DEFAULT NULL,
  `ctitle` varchar(9) DEFAULT NULL,
  `caddr1` varchar(30) DEFAULT NULL,
  `caddr2` varchar(30) DEFAULT NULL,
  `cstate` varchar(30) DEFAULT NULL,
  `ccity` varchar(30) DEFAULT NULL,
  `czip` varchar(30) DEFAULT NULL,
  `ccountry` varchar(30) DEFAULT NULL,
  `cphone` varchar(30) DEFAULT NULL,
  `cstatus` varchar(1) DEFAULT NULL,
  `dcreate` varchar(18) DEFAULT NULL,
  `crevncode` varchar(30) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

--
-- Table structure for table `arwhse`
--
DROP TABLE IF EXISTS `arwhse`;
CREATE TABLE `arwhse` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `cwarehouse` varchar(20) DEFAULT NULL,
  `cdescript` varchar(30) DEFAULT NULL,
  `caddr1` varchar(30) DEFAULT NULL,
  `caddr2` varchar(30) DEFAULT NULL,
  `ccity` varchar(30) DEFAULT NULL,
  `cstate` varchar(30) DEFAULT NULL,
  `czip` varchar(30) DEFAULT NULL,
  `ccountry` varchar(30) DEFAULT NULL,
  `cphone` varchar(30) DEFAULT NULL,
  `ccontact` varchar(30) DEFAULT NULL,
  `ctaxcode` varchar(30) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
INSERT INTO `arwhse` (id, cwarehouse, cdescript) VALUES (1,'MAIN','ALMACEN PRINCIPAL');

--
-- Table structure for table `cobank`
--
DROP TABLE IF EXISTS `cobank`;
CREATE TABLE `cobank` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ccurrcode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `csymbol` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ccurrname` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nxchgrate` double DEFAULT NULL,
  `dxchgrate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dlxchgrate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cxchgacc` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nlxchgrate` double DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

--
-- Table structure for table `costax`
--
DROP TABLE IF EXISTS `costax`;
CREATE TABLE `costax` (
  `id` int(2) NOT NULL AUTO_INCREMENT,
  `ctaxcode` decimal(4,2) DEFAULT NULL,
  `cdescript` varchar(18) DEFAULT NULL,
  `centity2` varchar(30) DEFAULT NULL,
  `centity1` varchar(6) DEFAULT NULL,
  `centity3` varchar(30) DEFAULT NULL,
  `cstaxacc1` int(11) DEFAULT NULL,
  `cstaxacc2` varchar(30) DEFAULT NULL,
  `cstaxacc3` varchar(30) DEFAULT NULL,
  `ltaxontax` bit(1) DEFAULT NULL,
  `ntaxrate1` decimal(4,2) DEFAULT NULL,
  `ntaxrate2` bit(1) DEFAULT NULL,
  `ntaxrate3` bit(1) DEFAULT NULL,
  `lgstcb` bit(1) DEFAULT NULL,
  `lpstcb` bit(1) DEFAULT NULL,
  `currency` varchar(10) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

--
-- Table structure for table `glaccounts`
--
DROP TABLE IF EXISTS `glaccounts`;
CREATE TABLE `glaccounts` (
  `id` varchar(5) NOT NULL,
  `description` varchar(50) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `catgid` varchar(5) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
INSERT INTO `glaccounts` (id, description, status, catgid) VALUES ('1001','Pacific Western bank #24004376','A','A1'),('1002','First National bank','A','A1'),('1003','Wells Fargo','A','A1'),('1004','First Business Financial services','A','A1'),('1005','Deposit in Transit','A','A1'),('1006','State Bank of Cross Plains','A','A1'),('1007','State Bank of Cross Plains checks','A','A1'),('1008','Banamex USA (QSA)','A','A1'),('1009','Pacific Western Bank #1001087368','A','A1'),('1101','Customers','A','A1'),('1102','Loans','A','A1'),('1105','Other Accounts Receivable','A','A1'),('1106','Advance Payments','A','A1'),('1107','Deposits','A','A1'),('1108','Sundry debtors','A','A1'),('1109','Doubtful Accounts','A','A1'),('1110','Afiliates Qsa','A','A1'),('1210','All Raw Materials','A','A1'),('1211','Unfinished Mouldings','A','A1'),('1212','Lumber','A','A1'),('1213','Glen Oak Added Value','A','A1'),('1214','Paint','A','A1'),('1216','Components for Blinds','A','A1'),('1218','Packaging Materials','A','A1'),('1220','On Consignment','A','A1'),('1222','In Transit','A','A1'),('1230','Other','A','A1'),('1290','Adjustments','A','A1'),('1310','Wood Mouldings','A','A1'),('1312','Blinds','A','A1'),('1314','In Transit','A','A1'),('1390','Adjustments','A','A1'),('1410','Other Assets','A','A1'),('1610','Office  Equipment','A','B1'),('1612','Off.Equip. Current Year','A','B1'),('1615','Computer Equipement','A','B1'),('1620','Machinery & Equipment','A','B1'),('1622','Machinery & Eq. Current year','A','B1'),('1630','Autos & Truks','A','B1'),('1632','Autos & Trucks - Current Year','A','B1'),('1710','Office Equipment','A','B1'),('1719','Accumulated Depreciation','A','B1'),('1720','Machinery & Equipment','A','B1'),('1730','Autos & Truck','A','B1'),('1740','In process machinary','A','B1'),('1810','Other','A','C1'),('1850','PAYMENTS IN ADVANCE','A','C1'),('1851','Insurance payments in advance','A','C1'),('1852','Payments in advance(Suppliers)','A','C1'),('1860','Guarantee deposits','A','C1'),('2100','Trade Payables','A','D1'),('2200','Other Payables','A','D1'),('2201','Pine River Lumber','A','D1'),('2202','Wolf River Lumber','A','D1'),('2300','Tax Payable','A','D1'),('2350','Sundry creditors','A','D1'),('2351','Qualfin SA','A','D1'),('2352','Erik Pineda','A','D1'),('2353','Evashin USA','A','D1'),('2354','Evashin Mex','A','D1'),('2355','Francisco Nieto','A','D1'),('2356','Jose Pineda','A','D1'),('2357','Sundry dep(deposits in transitAR)','A','D1'),('2358','Qualfin SA (Cred bnx)','A','D1'),('2359','Loans','A','D1'),('2360','State Bank','A','D1'),('2361','Pacific Western Bank','A','D1'),('2362','Fusta Blinds  SL','A','D1'),('2370','Customer payment in advance','A','D1'),('2380','Wages & Salaries','A','D1'),('2400','Long Term debt','A','E1'),('3000','Capital Stock','A','F1'),('3100','Retained Earnings','A','F1'),('3200','Current Period Earnings','A','F1'),('4010','Wood Mouldings','A','H1'),('4020','Custom Blinds','A','H1'),('4030','Wood Shutters','A','H1'),('4040','Services','A','H1'),('4050','Other','A','H1'),('4060','Distribution Products','A','H1'),('4120','Custom Blinds','A','H1'),('4130','Wood Shutters','A','H1'),('4140','Services','A','H1'),('4150','Other','A','H1'),('4210','All Products - Wholesale','A','H1'),('4310','All Products - Retail','A','H1'),('4410','Freight','A','H1'),('4510','Sales to Affiliates','A','H1'),('4550','Purchases & Expenses descounts','A','I1'),('4610','Other income','A','I1'),('4700','Sales descounts','A','J1'),('5010','Wood Mouldings','A','J1'),('5020','Custom Blinds','A','J1'),('5030','Wood Shutters','A','J1'),('5040','Conversion Cost','A','J1'),('5050','Other','A','J1'),('5060','Distribution Products','A','J1'),('5120','Custom Blinds','A','J1'),('5130','Wood Shutters','A','J1'),('5140','Services','A','J1'),('5150','Other','A','J1'),('5410','Freight Cost (Purchasing)','A','J1'),('5450','Discounts','A','J1'),('5510','Cost of Products to Affiliates','A','J1'),('5600','Import Duties & Expenses','A','J1'),('5601','Web  rent','A','J1'),('5602','Miscellaneous','A','J1'),('5603','Phones','A','J1'),('5604','Maintenance Expenses','A','J1'),('5610','Customs Broker\'s Fees','A','J1'),('5630','Sales tax Cost','A','J1'),('5640','Cost Variances','A','J1'),('5650','Inventory Adjustment Cost','A','J1'),('5660','Purchasing Discounts','A','J1'),('7010','Salaries','I','L1'),('7012','Federal Payroll taxes','I','L1'),('7014','State Payroll Taxes','I','L1'),('7020','Sales Commisions','A','L1'),('7040','Freight Cost (Selling)','A','L1'),('7041','Professional Fees','A','L1'),('7060','Insurance- Medical','A','L1'),('7061','Car insurance','A','L1'),('7070','Equipement Lease','A','L1'),('7071','Lease','A','L1'),('7072','Car leasing','A','L1'),('7080','Utilities','A','L1'),('7100','Licence & transportation expenses','A','O1'),('7120','Mail & Courier Services','A','L1'),('7160','Travel Expenses','A','L1'),('7162','Entertainment for Customers','A','L1'),('7164','Sales Promotion Materials','A','L1'),('7180','Gas & Maintenance','A','L1'),('7510','Salaries','A','M1'),('7512','Federal Payroll Taxes','A','M1'),('7514','State Payroll taxes','A','M1'),('7520','Franchise Tax','A','M1'),('7540','Accounting Fees','A','M1'),('7542','Legal Fees','A','M1'),('7600','General Expenses','A','N1'),('7700','Bank CHarges & Commissions','A','O1'),('7702','Bad Debt Expenses','A','O1'),('7704','General Interest Expense','A','O1'),('7705','Informatic expenses (software&hardw','A','O1'),('7706','Penalties','A','O1'),('7707','Maintenance Equipement expenses','A','O1'),('7750','Depreciation','A','O1'),('7760','Amortization- Current Year','A','O1'),('7765','Loss on sale of Fixed assets','A','O1'),('7770','Loss on sale of asset','A','O1'),('7800','Provision for Taxes','A','T1');

--
-- Table structure for table `icitem`
--
DROP TABLE IF EXISTS `icitem`;
CREATE TABLE `icitem` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `citemno` varchar(20) DEFAULT NULL,
  `cdescript` varchar(54) DEFAULT NULL,
  `ctype` varchar(10) DEFAULT NULL,
  `cbarcode1` varchar(30) DEFAULT NULL,
  `cbarcode2` varchar(30) DEFAULT NULL,
  `cstatus` varchar(1) DEFAULT NULL,
  `cmeasure` varchar(30) DEFAULT NULL,
  `cclass` varchar(9) DEFAULT NULL,
  `cprodline` varchar(8) DEFAULT NULL,
  `ccommiss` varchar(30) DEFAULT NULL,
  `cvendno` varchar(30) DEFAULT NULL,
  `cimagepath` varchar(30) DEFAULT NULL,
  `dcreate` varchar(15) DEFAULT NULL,
  `dlastsale` varchar(15) DEFAULT NULL,
  `dlastfnh` varchar(30) DEFAULT NULL,
  `dspstart` varchar(30) DEFAULT NULL,
  `dspend` varchar(30) DEFAULT NULL,
  `tmodified` varchar(16) DEFAULT NULL,
  `laritem` bit(1) DEFAULT NULL,
  `lpoitem` bit(1) DEFAULT NULL,
  `lmiitem` bit(1) DEFAULT NULL,
  `lioitem` bit(1) DEFAULT NULL,
  `lowrevncd` bit(1) DEFAULT NULL,
  `lkititem` bit(1) DEFAULT NULL,
  `lowcomp` bit(1) DEFAULT NULL,
  `ltaxable1` bit(1) DEFAULT NULL,
  `ltaxable2` bit(1) DEFAULT NULL,
  `lowdesc` bit(1) DEFAULT NULL,
  `lowprice` bit(1) DEFAULT NULL,
  `lowdisc` bit(1) DEFAULT NULL,
  `lowtax` bit(1) DEFAULT NULL,
  `lcomplst` bit(1) DEFAULT NULL,
  `lchkonhand` bit(1) DEFAULT NULL,
  `lupdonhand` bit(1) DEFAULT NULL,
  `lallowneg` bit(1) DEFAULT NULL,
  `lmlprice` bit(1) DEFAULT NULL,
  `lowivrmk` bit(1) DEFAULT NULL,
  `lptivrmk` bit(1) DEFAULT NULL,
  `lowsormk` bit(1) DEFAULT NULL,
  `lptsormk` bit(1) DEFAULT NULL,
  `lowpormk` bit(1) DEFAULT NULL,
  `lptpormk` bit(1) DEFAULT NULL,
  `lowmirmk` bit(1) DEFAULT NULL,
  `lptmirmk` bit(1) DEFAULT NULL,
  `ncosttype` bit(1) DEFAULT NULL,
  `nqtydec` int(11) DEFAULT NULL,
  `ndiscrate` int(11) DEFAULT NULL,
  `nweight` bit(1) DEFAULT NULL,
  `nstdcost` decimal(6,4) DEFAULT NULL,
  `nrtrncost` decimal(6,4) DEFAULT NULL,
  `nlfnhcost` bit(1) DEFAULT NULL,
  `nprice` decimal(8,4) DEFAULT NULL,
  `nspprice` decimal(5,3) DEFAULT NULL,
  `nlsalprice` decimal(7,4) DEFAULT NULL,
  `llot` bit(1) DEFAULT NULL,
  `lsubitem` bit(1) DEFAULT NULL,
  `lowweight` bit(1) DEFAULT NULL,
  `lprtsn` bit(1) DEFAULT NULL,
  `lprtlotno` bit(1) DEFAULT NULL,
  `lusekitno` bit(1) DEFAULT NULL,
  `lnegprice` bit(1) DEFAULT NULL,
  `cspectype1` varchar(30) DEFAULT NULL,
  `cspectype2` varchar(30) DEFAULT NULL,
  `cminptype` varchar(2) DEFAULT NULL,
  `lusespec` bit(1) DEFAULT NULL,
  `nminprice` bit(1) DEFAULT NULL,
  `lowcoms` bit(1) DEFAULT NULL,
  `cbuyer` varchar(2) DEFAULT NULL,
  `ldiscard` bit(1) DEFAULT NULL,
  `lrepair` bit(1) DEFAULT NULL,
  `nrstkpct` bit(1) DEFAULT NULL,
  `nrstkmin` bit(1) DEFAULT NULL,
  `nrepprice` bit(1) DEFAULT NULL,
  `llifetime` bit(1) DEFAULT NULL,
  `lowrarmk` bit(1) DEFAULT NULL,
  `lptrarmk` bit(1) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `ictype`;
CREATE TABLE `ictype` (
  `ctype` varchar(10) NOT NULL,
  `ctypedesc` varchar(40) NOT NULL,
  `citemdesc` varchar(54) NOT NULL,
  `cmeasure` varchar(10) NOT NULL,
  `cclass` varchar(10) NOT NULL,
  `cprodline` varchar(10) NOT NULL,
  `ccommiss` varchar(10) NOT NULL,
  `crevncode` varchar(10) NOT NULL,
  `cinvtacc` varchar(30) NOT NULL,
  `cintracc` varchar(30) NOT NULL,
  `cstatus` varchar(50) NOT NULL,
  `laritem` int(4) NOT NULL,
  `lpoitem` int(4) NOT NULL,
  `lmiitem` int(4) NOT NULL,
  `lioitem` int(4) NOT NULL,
  `lkititem` int(4) NOT NULL,
  `llot` int(4) NOT NULL,
  `luserkitno` int(4) NOT NULL,
  `ltaxable1` int(4) NOT NULL,
  `ltaxable2` int(4) NOT NULL,
  `lchkonhand` int(4) NOT NULL,
  `lupdonhand` int(4) NOT NULL,
  `lallowneg` int(4) NOT NULL,
  `lowdesc` int(4) NOT NULL,
  `lowprice` int(4) NOT NULL,
  `lowdisc` int(4) NOT NULL,
  `lowtax` int(4) NOT NULL,
  `lowrevncd` int(4) NOT NULL,
  `lowivrmk` int(4) NOT NULL,
  `lptivrmx` int(4) NOT NULL,
  `lowsormk` int(4) NOT NULL,
  `lptsormk` int(4) NOT NULL,
  `lowpormk` int(4) NOT NULL,
  `lptpormk` int(4) NOT NULL,
  `lowirmk` int(4) NOT NULL,
  `lptirmk` int(4) NOT NULL,
  `ncosttype` int(4) NOT NULL,
  `nqtydesc` int(4) NOT NULL,
  `ndiscrate2` decimal(8,0) NOT NULL,
  `nweight2` decimal(18,0) NOT NULL,
  `nstdcost4` decimal(18,0) NOT NULL,
  `nrtrncost4` decimal(18,0) NOT NULL,
  `nprice4` decimal(18,0) NOT NULL,
  `lowcomp` int(4) NOT NULL,
  `lowweight` int(4) NOT NULL,
  `lprtsn` int(4) NOT NULL,
  `lprtlotno` int(4) NOT NULL,
  `lnegprice` int(4) NOT NULL,
  `lusespec` int(4) NOT NULL,
  `ldiscard` int(4) NOT NULL,
  `lrepair` int(4) NOT NULL,
  `nrstkpct2` decimal(8,0) NOT NULL,
  `nrstkmin2` decimal(18,0) NOT NULL,
  `nrepprice4` decimal(18,0) NOT NULL,
  `lowrarmk` int(4) NOT NULL,
  `lptrarmk` int(4) NOT NULL
) ENGINE=InnoDB;
INSERT INTO `ictype` (`ctype`, `ctypedesc`, `citemdesc`, `cmeasure`, `cclass`, `cprodline`, `ccommiss`, `crevncode`, `cinvtacc`, `cintracc`, `cstatus`, `laritem`, `lpoitem`, `lmiitem`, `lioitem`, `lkititem`, `llot`, `luserkitno`, `ltaxable1`, `ltaxable2`, `lchkonhand`, `lupdonhand`, `lallowneg`, `lowdesc`, `lowprice`, `lowdisc`, `lowtax`, `lowrevncd`, `lowivrmk`, `lptivrmx`, `lowsormk`, `lptsormk`, `lowpormk`, `lptpormk`, `lowirmk`, `lptirmk`, `ncosttype`, `nqtydesc`, `ndiscrate2`, `nweight2`, `nstdcost4`, `nrtrncost4`, `nprice4`, `lowcomp`, `lowweight`, `lprtsn`, `lprtlotno`, `lnegprice`, `lusespec`, `ldiscard`, `lrepair`, `nrstkpct2`, `nrstkmin2`, `nrepprice4`, `lowrarmk`, `lptrarmk`) VALUES
('SAPI', 'Items purchased for QF SAPI', 'Items for SAPI', '', 'M', '1200', '', '4SAPI', '1110', '1110', 'A', 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, '0', '0', '0', '0', '0', 0, 0, 0, 0, 0, 0, 0, 0, '0', '0', '0', 0, 0),
('BLINDCOMP', 'Blind Components', 'Blind Components', '', 'PACKPER', 'PPVARIOS', '', 'OTH', '1216', '1222', 'A', 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, '0', '0', '0', '0', '0', 0, 0, 0, 0, 0, 0, 0, 0, '0', '0', '0', 0, 0),
('CORNISAS', 'Cornisas de Madera o Aluminio', 'Cornisas', '', 'COR', 'CORNISAS', '', 'OTH', '1230', '1222', 'A', 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, '0', '0', '0', '0', '0', 0, 0, 0, 0, 0, 0, 0, 0, '0', '0', '0', 0, 0),
('FI', 'Finishing', 'Finishing', '', 'FI', '', '', 'FINISHING', '1210', '1210', 'A', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, '0', '0', '0', '0', '0', 0, 0, 0, 0, 0, 0, 0, 0, '0', '0', '0', 0, 0),
('FREIGHT', 'Freight charges', 'Freight charges', '', 'FRG', 'FRG', '', 'FRG', '1210', '4410', 'A', 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, '0', '0', '0', '0', '0', 0, 0, 0, 0, 0, 0, 0, 0, '0', '0', '0', 0, 0),
('LUMBER', 'Lumber', 'Lumber', '', 'LU', '', '', 'PO', '1210', '1222', 'A', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, '0', '0', '0', '0', '0', 0, 0, 0, 0, 0, 0, 0, 0, '0', '0', '0', 0, 0),
('MAINT', 'Maintenance Items', 'Maintenance Items', '', 'MAINT', 'MAINT', '', 'OTH', '1622', '1222', 'A', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, '0', '0', '0', '0', '0', 0, 0, 0, 0, 0, 0, 0, 0, '0', '0', '0', 0, 0),
('MISC', 'Misc Charges', 'Charges that include credits and corrections', '', '', '', '', 'OTH', '1210', '1210', 'A', 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, '0', '0', '0', '0', '0', 0, 0, 0, 0, 0, 0, 0, 0, '0', '0', '0', 0, 0),
('MO', 'Wood Mouldings', 'Wood Mouldings', '', 'WMB', '', '', 'WMB', '1210', '1222', 'A', 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, '0', '0', '0', '0', '0', 0, 0, 0, 0, 0, 0, 0, 0, '0', '0', '0', 0, 0),
('PACK', 'Packaging Materials', 'Packaging', '', 'PACK', '', '', 'PO', '1210', '1222', 'A', 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, '0', '0', '0', '0', '0', 0, 0, 0, 0, 0, 0, 0, 0, '0', '0', '0', 0, 0),
('PAINT', 'Paint', 'Paint', '', 'PAINT', '', '', 'PO', '1214', '1222', 'A', 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, '0', '0', '0', '0', '0', 0, 0, 0, 0, 0, 0, 0, 0, '0', '0', '0', 0, 0),
('SMPL', 'Samples & Swatches', 'Samples & Swatches', '', 'SMPL', '', '', 'OTH', '1230', '1222', 'A', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, '0', '0', '0', '0', '0', 0, 0, 0, 0, 0, 0, 0, 0, '0', '0', '0', 0, 0),
('UNFINISHED', 'Unfinished Mouldings', 'Unfinished', '', 'UNF', '', '', 'PO', '1210', '1222', 'A', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, '0', '0', '0', '0', '0', 0, 0, 0, 0, 0, 0, 0, 0, '0', '0', '0', 0, 0);

--
-- Table structure for table `arsyst`
--
DROP TABLE IF EXISTS `arsyst`;
CREATE TABLE `arsyst` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `start_range` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_range` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purge_invoices_dates` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purge_payments_dates` tinyint(1) unsigned DEFAULT NULL,
  `unit_cost` int(11) unsigned DEFAULT NULL,
  `unit_price` int(11) unsigned DEFAULT NULL,
  `quantity` int(11) unsigned DEFAULT NULL,
  `next_invoice` int(11) unsigned DEFAULT NULL,
  `usgi` tinyint(1) unsigned DEFAULT NULL,
  `atelc` tinyint(1) unsigned DEFAULT NULL,
  `anging_range_date_1` int(11) unsigned DEFAULT NULL,
  `anging_range_date_2` int(11) unsigned DEFAULT NULL,
  `anging_range_date_3` int(11) unsigned DEFAULT NULL,
  `anging_range_date_4` int(11) unsigned DEFAULT NULL,
  `idescription` tinyint(1) unsigned DEFAULT NULL,
  `dpercentage` tinyint(1) unsigned DEFAULT NULL,
  `uprice` tinyint(1) unsigned DEFAULT NULL,
  `remark` tinyint(1) unsigned DEFAULT NULL,
  `cfcbw` tinyint(1) unsigned DEFAULT NULL,
  `credit_limit` int(11) unsigned DEFAULT NULL,
  `statement` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `umtpboet` int(11) unsigned DEFAULT NULL,
  `arfrgt_id` int(11) unsigned DEFAULT NULL,
  `arfob_id` int(11) unsigned DEFAULT NULL,
  `arpycd_id` int(11) unsigned DEFAULT NULL,
  `arrevn_id` int(11) unsigned DEFAULT NULL,
  `arwhse_id` int(11) unsigned DEFAULT NULL,
  `cpd` int(11) unsigned DEFAULT NULL,
  `msb` int(11) unsigned DEFAULT NULL,
  `charge` int(11) unsigned DEFAULT NULL,
  `mca` int(11) unsigned DEFAULT NULL,
  `pdib` int(11) unsigned DEFAULT NULL,
  `prate` int(11) unsigned DEFAULT NULL,
  `invoices` tinyint(1) unsigned DEFAULT NULL,
  `pslips` tinyint(1) unsigned DEFAULT NULL,
  `statements` tinyint(1) unsigned DEFAULT NULL,
  `account_receivables` int(11) unsigned DEFAULT NULL,
  `inventory_stock` int(11) unsigned DEFAULT NULL,
  `inventory_non_stock` int(11) unsigned DEFAULT NULL,
  `customer_deposits` int(11) unsigned DEFAULT NULL,
  `open_credit_refunds` int(11) unsigned DEFAULT NULL,
  `sales_taxes_payables` int(11) unsigned DEFAULT NULL,
  `invoice_adjustaments` int(11) unsigned DEFAULT NULL,
  `freight_revenue` int(11) unsigned DEFAULT NULL,
  `interest_income` int(11) unsigned DEFAULT NULL,
  `cost_of_variances` int(11) unsigned DEFAULT NULL,
  `inventory_adjustements` int(11) unsigned DEFAULT NULL,
  `payment_term_discount` int(11) unsigned DEFAULT NULL,
  `payment_adjustements` int(11) unsigned DEFAULT NULL,
  `bad_deb_expense` int(11) unsigned DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_foreignkey_arsyst_arfrgt` (`arfrgt_id`),
  KEY `index_foreignkey_arsyst_arfob` (`arfob_id`),
  KEY `index_foreignkey_arsyst_arpycd` (`arpycd_id`),
  KEY `index_foreignkey_arsyst_arrevn` (`arrevn_id`),
  KEY `index_foreignkey_arsyst_arwhse` (`arwhse_id`)
) ENGINE=InnoDB;
INSERT INTO `arsyst` (`id`) VALUES ('1');

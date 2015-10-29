(function(){
	angular.module('app', []);

	angular.module('app')
		.controller('AppController', AppController);

	AppController.$inject = ['$scope'];
	function AppController($scope) {
		$scope.apLevels = [0,10000,30000,70000,150000,300000,600000,1200000,2400000,4000000,6000000,8400000,12000000,17000000,24000000,40000000];
		$scope.Defs = {
			PORTAL_MAX : 8
		};
		$scope.Actions = {
			ENEMY_PORTAL_HACK : 100,
			FIELD_CREATE : 1250,
			FIELD_DESTROY : 750,
			FULL_RESO_BONUS : 250,
			LINK_CREATE : 313,
			LINK_DESTROY : 187,
			NEUTRAL_PORTAL : 500,
			RESO_MAKE : 125,
			RESO_DESTROY : 75,
			RESO_UPGRADE : 65,
			RESO_RECHARGE : 10,
			MOD_DEPLOY : 125
		};

		$scope.tab = {};
		$scope.activateTab = function(tab){
			angular.forEach( $scope.tab, function(value, key, item){
				item[key] = false;
				if(key == tab) item[key] = true;
				console.log(key, value, item, tab);
			});
		}

		$scope.doCalc = function(){
			var currAP = $scope.currAP;
			var portalLinks = $scope.portalLinks;
			var portalFields = $scope.portalFields;
			var nextLevel = 1;
			var apNextLevel = 0;
			var apLevels = $scope.apLevels;
			var Defs = $scope.Defs;
			var Actions = $scope.Actions;

			currAP = (isNaN(currAP) ? 0 : currAP);
			portalLinks = (isNaN(portalLinks) ? 0 : portalLinks);
			portalFields = (isNaN(portalFields) ? 0 : portalFields);

			for (var i = 0; i < apLevels.length; ++i) {
				if (currAP >= apLevels[i]) {
					nextLevel = i + 2;
				} else {
					break;
				}
			}

			if (nextLevel > apLevels.length) {
				nextLevel = apLevels.length;
				apNextLevel = apLevels[nextLevel - 1];
			} else {
				apNextLevel = apLevels[nextLevel - 1] - currAP;
			}

			// determine how many links required 
			// to round AP last digit to zero
			// by just creating links
			for (var perfectMatchLinkCreate = 0; perfectMatchLinkCreate < 10; ++perfectMatchLinkCreate ){
				var acum = Actions.LINK_CREATE * perfectMatchLinkCreate;
				console.log(perfectMatchLinkCreate, acum);
				console.log(apNextLevel - acum, (apNextLevel - acum) % 10);
				if( (apNextLevel - acum) % 10 == 0 ){
					break;				
				}
			}

			$scope.nextLevel = nextLevel;
			$scope.apNextLevel = apNextLevel;

			// per item
			$scope.enemyPortalHack = Math.round(apNextLevel / Actions.ENEMY_PORTAL_HACK);

			$scope.fieldMake = Math.round(apNextLevel / Actions.FIELD_CREATE);
			$scope.fieldDestroy = Math.round(apNextLevel / Actions.FIELD_DESTROY);

			$scope.linkMake = Math.round(apNextLevel / Actions.LINK_CREATE);
			$scope.linkDestroy = Math.round(apNextLevel / Actions.LINK_DESTROY);

			$scope.resoMake = Math.round(apNextLevel / Actions.RESO_MAKE);
			$scope.resoDestroy = Math.round(apNextLevel / Actions.RESO_DESTROY);

			$scope.neutralPortal = Math.round(apNextLevel / Actions.NEUTRAL_PORTAL);

			$scope.modDeploy = Math.round(apNextLevel / Actions.MOD_DEPLOY);


			// situations
			perfectMatchRemainingAP = apNextLevel;
			$scope.perfectMatchLinkCreate = perfectMatchLinkCreate;
			$scope.perfectMatchLinkCreateAP = perfectMatchLinkCreate * Actions.LINK_CREATE;
			perfectMatchRemainingAP = perfectMatchRemainingAP - perfectMatchLinkCreate * Actions.LINK_CREATE;
			apOnePortalFull = (Actions.RESO_MAKE * Defs.PORTAL_MAX) + Actions.FULL_RESO_BONUS;
			perfectMatchPortalFull = Math.floor(perfectMatchRemainingAP / apOnePortalFull);
			perfectMatchRemainingAP = perfectMatchRemainingAP - perfectMatchPortalFull * apOnePortalFull;
			$scope.perfectMatchPortalFull = perfectMatchPortalFull;
			$scope.perfectMatchPortalFullAP = perfectMatchPortalFull*apOnePortalFull;
			$scope.perfectMatchRemainingAP = perfectMatchRemainingAP;

			$scope.portalFull = Math.floor(apNextLevel / (
				(Actions.RESO_MAKE * Defs.PORTAL_MAX) + Actions.FULL_RESO_BONUS
			));
			$scope.portalFullRemaining =  apNextLevel - $scope.portalFull*((Actions.RESO_MAKE * Defs.PORTAL_MAX) + Actions.FULL_RESO_BONUS);

			$scope.portalFullEnemy = Math.round(apNextLevel / (
				(Actions.RESO_DESTROY * Defs.PORTAL_MAX) +
				(Actions.NEUTRAL_PORTAL) +
				(Actions.RESO_MAKE * Defs.PORTAL_MAX) + Actions.FULL_RESO_BONUS
			));

			$scope.portalFullDestroy = Math.round(apNextLevel / (
				(Actions.RESO_DESTROY * Defs.PORTAL_MAX)
			));

			$scope.fullDestroyLinks = Math.round(apNextLevel / (
				(Actions.RESO_DESTROY * Defs.PORTAL_MAX) +
				(Actions.LINK_DESTROY * portalLinks)
			));

			$scope.fullDestroyFields = Math.round(apNextLevel / (
				(Actions.RESO_DESTROY * Defs.PORTAL_MAX) +
				(Actions.LINK_DESTROY * (portalFields * 2)) +
				(Actions.FIELD_DESTROY * portalFields)
			));


			// calc
			var calcWorth = 0;
			var calcToLevel = 0;
			var valTemp;
			if ($scope.doHackEnemy) {
				valTemp = (isNaN($scope.doHackEnemyCount) ? 0 : $scope.doHackEnemyCount);
				calcWorth += (valTemp * Actions.ENEMY_PORTAL_HACK);
			}
			if ($scope.doDestroyReso) {
				valTemp = (isNaN($scope.doDestroyResoCount) ? 0 : $scope.doDestroyResoCount);
				calcWorth += (valTemp * Actions.RESO_DESTROY);
			}
			if ($scope.doDestroyLink) {
				valTemp = (isNaN($scope.doDestroyLinkCount) ? 0 : $scope.doDestroyLinkCount);
				calcWorth += (valTemp * Actions.LINK_DESTROY);
			}
			if ($scope.doDestroyField) {
				valTemp = (isNaN($scope.doDestroyFieldCount) ? 0 : $scope.doDestroyFieldCount);
				calcWorth += (valTemp * (Actions.LINK_DESTROY * 2));
				calcWorth += (valTemp * Actions.FIELD_DESTROY);
			}
			if ($scope.doCapNeutral) {
				valTemp = (isNaN($scope.doCapNeutralCount) ? 0 : $scope.doCapNeutralCount);
				calcWorth += (valTemp * Actions.NEUTRAL_PORTAL);
			}
			if ($scope.doDeployReso) {
				valTemp = (isNaN($scope.doDeployResoCount) ? 0 : $scope.doDeployResoCount);
				calcWorth += (valTemp * Actions.RESO_MAKE);
				calcWorth += (valTemp >= 8 ? Actions.FULL_RESO_BONUS : 0);
			}
			if ($scope.doModDeploy) {
				valTemp = (isNaN($scope.doModDeployCount) ? 0 : $scope.doModDeployCount);
				calcWorth += (valTemp * Actions.MOD_DEPLOY);
			}
			if ($scope.doCreateLink) {
				valTemp = (isNaN($scope.doCreateLinkCount) ? 0 : $scope.doCreateLinkCount);
				calcWorth += (valTemp * Actions.LINK_CREATE);
			}
			if ($scope.doCreateField) {
				valTemp = (isNaN($scope.doCreateFieldCount) ? 0 : $scope.doCreateFieldCount);
				calcWorth += (valTemp * (Actions.LINK_CREATE * 2));
				calcWorth += (valTemp * Actions.FIELD_CREATE);
			}
			if ($scope.doRecharge) {
				valTemp = (isNaN($scope.doRechargeCount) ? 0 : $scope.doRechargeCount);
				calcWorth += (valTemp * Actions.RESO_RECHARGE);
			}
			if ($scope.doUpgradeReso) {
				valTemp = (isNaN($scope.doUpgradeResoCount) ? 0 : $scope.doUpgradeResoCount);
				calcWorth += (valTemp * Actions.RESO_UPGRADE);
			}

			// calcToLevel = (calcWorth > 0 ? Math.round(apNextLevel / calcWorth) : 0);
			calcToLevel = (calcWorth > 0 ? (apNextLevel - calcWorth) : 0);

			$scope.calcWorth = calcWorth;
			$scope.calcToLevel = calcToLevel;
		}

		watchGroup = ['currAP', 'portalLinks', 'portalFields', 'doHackEnemyCount', 'doDestroyResoCount', 'doDestroyLinkCount', 'doDestroyFieldCount', 'doCapNeutralCount', 'doDeployResoCount', 'doModDeployCount', 'doCreateLinkCount', 'doCreateFieldCount', 'doRechargeCount', 'doUpgradeResoCount', 'doHackEnemy', 'doDestroyReso', 'doDestroyLink', 'doDestroyField', 'doCapNeutral', 'doDeployReso', 'doModDeploy', 'doCreateLink', 'doCreateField', 'doRecharge', 'doUpgradeReso'];

		$scope.$watchGroup(watchGroup, function(newVal, oldVal){
			console.log("Cambio!", newVal, oldVal);
			$scope.doCalc();
		});
	}
})();


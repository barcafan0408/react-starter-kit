require("source-map-support").install();
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "updates/" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "updates/" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "c0fa4b528f9e3122ed17"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) me.children.push(request);
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (typeof dep === "undefined") hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (typeof dep === "undefined") hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle")
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			for(var chunkId in installedChunks)
/******/ 			{
/******/ 				// eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded chunks
/******/ 	// "0" means "already loaded"
/******/ 	var installedChunks = {
/******/ 		"server": 0
/******/ 	};
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// require() chunk loading for javascript
/******/
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] !== 0) {
/******/ 			var chunk = require("./chunks/" + ({"home~not-found":"home~not-found","home":"home","not-found":"not-found"}[chunkId]||chunkId) + ".js");
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids;
/******/ 			for(var moduleId in moreModules) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// uncaught error handler for webpack runtime
/******/ 	__webpack_require__.oe = function(err) {
/******/ 		process.nextTick(function() {
/******/ 			throw err; // catch this error by using import().catch()
/******/ 		});
/******/ 	};
/******/
/******/ 	// object with all compiled WebAssembly.Modules
/******/ 	__webpack_require__.w = {};
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./chunk-manifest.json":
/***/ (function(module, exports) {

module.exports = require("./chunk-manifest.json");

/***/ }),

/***/ "./node_modules/css-loader/index.js??ref--5-rules-2!./node_modules/postcss-loader/lib/index.js??ref--5-rules-3!./src/routes/error/ErrorPage.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(true);
// imports


// module
exports.push([module.i, "/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-present Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\nhtml {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-pack: center;\n      justify-content: center;\n  padding: 0 32px;\n  padding: 0 2rem;\n  height: 100%;\n  font-family: sans-serif;\n  text-align: center;\n  color: #888;\n}\n\nbody {\n  margin: 0;\n}\n\nh1 {\n  font-weight: 400;\n  color: #555;\n}\n\npre {\n  white-space: pre-wrap;\n  text-align: left;\n}\n", "", {"version":3,"sources":["/home/alex/ElifTech-School/react-starter-kit/src/routes/error/ErrorPage.css"],"names":[],"mappings":"AAAA;;;;;;;GAOG;;AAEH;EACE,qBAAqB;EACrB,cAAc;EACd,uBAAuB;MACnB,oBAAoB;EACxB,sBAAsB;MAClB,wBAAwB;EAC5B,gBAAgB;EAChB,gBAAgB;EAChB,aAAa;EACb,wBAAwB;EACxB,mBAAmB;EACnB,YAAY;CACb;;AAED;EACE,UAAU;CACX;;AAED;EACE,iBAAiB;EACjB,YAAY;CACb;;AAED;EACE,sBAAsB;EACtB,iBAAiB;CAClB","file":"ErrorPage.css","sourcesContent":["/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-present Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\nhtml {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-pack: center;\n      justify-content: center;\n  padding: 0 32px;\n  padding: 0 2rem;\n  height: 100%;\n  font-family: sans-serif;\n  text-align: center;\n  color: #888;\n}\n\nbody {\n  margin: 0;\n}\n\nh1 {\n  font-weight: 400;\n  color: #555;\n}\n\npre {\n  white-space: pre-wrap;\n  text-align: left;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/isomorphic-style-loader/lib/insertCss.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _stringify = __webpack_require__("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _slicedToArray2 = __webpack_require__("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Isomorphic CSS style loader for Webpack
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

var prefix = 's';
var inserted = {};

// Base64 encoding and decoding - The "Unicode Problem"
// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}

/**
 * Remove style/link elements for specified node IDs
 * if they are no longer referenced by UI components.
 */
function removeCss(ids) {
  ids.forEach(function (id) {
    if (--inserted[id] <= 0) {
      var elem = document.getElementById(prefix + id);
      if (elem) {
        elem.parentNode.removeChild(elem);
      }
    }
  });
}

/**
 * Example:
 *   // Insert CSS styles object generated by `css-loader` into DOM
 *   var removeCss = insertCss([[1, 'body { color: red; }']]);
 *
 *   // Remove it from the DOM
 *   removeCss();
 */
function insertCss(styles) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$replace = _ref.replace,
      replace = _ref$replace === undefined ? false : _ref$replace,
      _ref$prepend = _ref.prepend,
      prepend = _ref$prepend === undefined ? false : _ref$prepend;

  var ids = [];
  for (var i = 0; i < styles.length; i++) {
    var _styles$i = (0, _slicedToArray3.default)(styles[i], 4),
        moduleId = _styles$i[0],
        css = _styles$i[1],
        media = _styles$i[2],
        sourceMap = _styles$i[3];

    var id = moduleId + '-' + i;

    ids.push(id);

    if (inserted[id]) {
      if (!replace) {
        inserted[id]++;
        continue;
      }
    }

    inserted[id] = 1;

    var elem = document.getElementById(prefix + id);
    var create = false;

    if (!elem) {
      create = true;

      elem = document.createElement('style');
      elem.setAttribute('type', 'text/css');
      elem.id = prefix + id;

      if (media) {
        elem.setAttribute('media', media);
      }
    }

    var cssText = css;
    if (sourceMap && typeof btoa === 'function') {
      // skip IE9 and below, see http://caniuse.com/atob-btoa
      cssText += '\n/*# sourceMappingURL=data:application/json;base64,' + b64EncodeUnicode((0, _stringify2.default)(sourceMap)) + '*/';
      cssText += '\n/*# sourceURL=' + sourceMap.file + '?' + id + '*/';
    }

    if ('textContent' in elem) {
      elem.textContent = cssText;
    } else {
      elem.styleSheet.cssText = cssText;
    }

    if (create) {
      if (prepend) {
        document.head.insertBefore(elem, document.head.childNodes[0]);
      } else {
        document.head.appendChild(elem);
      }
    }
  }

  return removeCss.bind(null, ids);
}

module.exports = insertCss;

/***/ }),

/***/ "./package.json":
/***/ (function(module) {

module.exports = {"name":"web","version":"0.0.0","private":true,"engines":{"node":">=6.13.1","npm":">=3.10.10"},"browserslist":[">1%","last 4 versions","Firefox ESR","not ie < 9"],"dependencies":{"@babel/polyfill":"^7.0.0-beta.42","bluebird":"^3.5.1","body-parser":"^1.18.2","classnames":"^2.2.5","cookie-parser":"^1.4.3","core-js":"^2.5.3","express":"^4.16.3","history":"^4.7.2","isomorphic-style-loader":"^4.0.0","jsonwebtoken":"^8.2.0","lodash":"^4.17.10","node-fetch":"^2.1.1","normalize.css":"^8.0.0","pretty-error":"^2.1.1","prop-types":"^15.6.1","query-string":"^6.0.0","react":"^16.2.0","react-dom":"^16.2.0","react-redux":"^5.0.6","redux":"^3.7.2","redux-devtools-extension":"^2.13.2","redux-logger":"^3.0.6","redux-thunk":"^2.2.0","serialize-javascript":"^1.4.0","source-map-support":"^0.5.4","sqlite3":"^4.0.0","universal-router":"^6.0.0","whatwg-fetch":"^2.0.3"},"devDependencies":{"@babel/core":"^7.0.0-beta.42","@babel/node":"^7.0.0-beta.42","@babel/plugin-transform-react-constant-elements":"^7.0.0-beta.42","@babel/plugin-transform-react-inline-elements":"^7.0.0-beta.42","@babel/preset-env":"^7.0.0-beta.42","@babel/preset-flow":"^7.0.0-beta.42","@babel/preset-react":"^7.0.0-beta.42","@babel/preset-stage-2":"^7.0.0-beta.42","autoprefixer":"^8.1.0","babel-core":"^7.0.0-0","babel-eslint":"^8.2.2","babel-jest":"^22.4.3","babel-loader":"^8.0.0-beta.2","babel-plugin-transform-react-remove-prop-types":"^0.4.13","browser-sync":"^2.23.6","chokidar":"^2.0.2","css-loader":"^0.28.11","enzyme":"^3.3.0","eslint":"^4.19.0","eslint-config-airbnb":"^16.1.0","eslint-config-prettier":"^2.9.0","eslint-import-resolver-node":"^0.3.2","eslint-loader":"^2.0.0","eslint-plugin-css-modules":"^2.7.5","eslint-plugin-flowtype":"^2.46.1","eslint-plugin-import":"^2.9.0","eslint-plugin-jsx-a11y":"^6.0.3","eslint-plugin-prettier":"^2.6.0","eslint-plugin-react":"^7.7.0","file-loader":"^1.1.11","flow-bin":"^0.68.0","front-matter":"^2.3.0","glob":"^7.1.2","husky":"^0.14.3","identity-obj-proxy":"^3.0.0","jest":"^22.4.3","lint-staged":"^7.0.0","markdown-it":"^8.4.1","mkdirp":"^0.5.1","null-loader":"^0.1.1","opn-cli":"^3.1.0","pixrem":"^4.0.1","pleeease-filters":"^4.0.0","postcss":"^6.0.20","postcss-calc":"^6.0.1","postcss-color-function":"^4.0.1","postcss-custom-media":"^6.0.0","postcss-custom-properties":"^7.0.0","postcss-custom-selectors":"^4.0.1","postcss-flexbugs-fixes":"^3.3.0","postcss-import":"^11.1.0","postcss-loader":"^2.1.3","postcss-media-minmax":"^3.0.0","postcss-nested":"^3.0.0","postcss-nesting":"^4.2.1","postcss-pseudoelements":"^5.0.0","postcss-selector-matches":"^3.0.1","postcss-selector-not":"^3.0.1","prettier":"^1.11.1","raw-loader":"^0.5.1","react-deep-force-update":"^2.1.1","react-dev-utils":"^5.0.0","react-error-overlay":"^4.0.0","react-test-renderer":"^16.2.0","redux-mock-store":"^1.4.0","rimraf":"^2.6.2","stylelint":"^9.1.3","stylelint-config-standard":"^18.2.0","stylelint-order":"^0.8.1","svg-url-loader":"^2.3.2","url-loader":"^1.0.1","webpack":"^4.2.0","webpack-assets-manifest":"^2.0.0","webpack-bundle-analyzer":"^2.11.1","webpack-dev-middleware":"^3.0.1","webpack-hot-middleware":"^2.21.2","webpack-node-externals":"^1.6.0"},"lint-staged":{"*.{js,jsx}":["eslint --no-ignore --fix","git add --force"],"*.{json,md,graphql}":["prettier --write","git add --force"],"*.{css,less,styl,scss,sass,sss}":["stylelint --fix","git add --force"]},"scripts":{"precommit":"lint-staged","lint-js":"eslint --ignore-path .gitignore --ignore-pattern \"!**/.*\" .","lint-css":"stylelint \"src/**/*.{css,less,styl,scss,sass,sss}\"","lint":"yarn run lint-js && yarn run lint-css","fix-js":"yarn run lint-js --fix","fix-css":"yarn run lint-css --fix","fix":"yarn run fix-js && yarn run fix-css","flow":"flow","flow:check":"flow check","clean":"babel-node tools/run clean","copy":"babel-node tools/run copy","bundle":"babel-node tools/run bundle","build":"babel-node tools/run build","build-stats":"yarn run build --release --analyse","deploy":"babel-node tools/run deploy","render":"babel-node tools/run render","serve":"babel-node tools/run runServer","start":"babel-node tools/run start"}};

/***/ }),

/***/ "./src/actions/runtime.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setRuntimeVariable", function() { return setRuntimeVariable; });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/constants/index.js");
/* eslint-disable import/prefer-default-export */

function setRuntimeVariable(_ref) {
  var name = _ref.name,
      value = _ref.value;
  return {
    type: _constants__WEBPACK_IMPORTED_MODULE_0__["SET_RUNTIME_VARIABLE"],
    payload: {
      name: name,
      value: value
    }
  };
}

/***/ }),

/***/ "./src/components/App.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("prop-types");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_2__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




var ContextType = _objectSpread({
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func.isRequired,
  // Universal HTTP client
  fetch: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func.isRequired,
  pathname: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  query: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object
}, react_redux__WEBPACK_IMPORTED_MODULE_2__["Provider"].childContextTypes);
/**
 * The top-level React component setting context (global) variables
 * that can be accessed from all the child components.
 *
 * https://facebook.github.io/react/docs/context.html
 *
 * Usage example:
 *
 *   const context = {
 *     history: createBrowserHistory(),
 *     store: createStore(),
 *   };
 *
 *   ReactDOM.render(
 *     <App context={context}>
 *       <Layout>
 *         <LandingPage />
 *       </Layout>
 *     </App>,
 *     container,
 *   );
 */


var App =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(App, _React$PureComponent);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
  }

  _createClass(App, [{
    key: "getChildContext",
    value: function getChildContext() {
      return this.props.context;
    }
  }, {
    key: "render",
    value: function render() {
      // NOTE: If you need to add or modify header, footer etc. of the app,
      // please do that inside the Layout component.
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.Children.only(this.props.children);
    }
  }]);

  return App;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);

Object.defineProperty(App, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    context: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape(ContextType).isRequired,
    children: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.element.isRequired
  }
});
Object.defineProperty(App, "childContextTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ContextType
});
/* harmony default export */ __webpack_exports__["default"] = (App);

/***/ }),

/***/ "./src/components/Html.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("prop-types");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var serialize_javascript__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("serialize-javascript");
/* harmony import */ var serialize_javascript__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(serialize_javascript__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/config.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_config__WEBPACK_IMPORTED_MODULE_3__);
var _jsxFileName = "/home/alex/ElifTech-School/react-starter-kit/src/components/Html.js";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




/* eslint-disable react/no-danger */

var Html =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Html, _React$Component);

  function Html() {
    _classCallCheck(this, Html);

    return _possibleConstructorReturn(this, (Html.__proto__ || Object.getPrototypeOf(Html)).apply(this, arguments));
  }

  _createClass(Html, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          title = _props.title,
          description = _props.description,
          styles = _props.styles,
          scripts = _props.scripts,
          app = _props.app,
          children = _props.children;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("html", {
        className: "no-js",
        lang: "en",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 40
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("head", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 41
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("meta", {
        charSet: "utf-8",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 42
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("meta", {
        httpEquiv: "x-ua-compatible",
        content: "ie=edge",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 43
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("title", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 44
        },
        __self: this
      }, title), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("meta", {
        name: "description",
        content: description,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 45
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 46
        },
        __self: this
      }), scripts.map(function (script) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("link", {
          key: script,
          rel: "preload",
          href: script,
          as: "script",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 48
          },
          __self: this
        });
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("link", {
        rel: "manifest",
        href: "/site.webmanifest",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 50
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("link", {
        rel: "apple-touch-icon",
        href: "/icon.png",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 51
        },
        __self: this
      }), styles.map(function (style) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("style", {
          key: style.id,
          id: style.id,
          dangerouslySetInnerHTML: {
            __html: style.cssText
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 53
          },
          __self: this
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("body", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 60
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "app",
        dangerouslySetInnerHTML: {
          __html: children
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 61
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("script", {
        dangerouslySetInnerHTML: {
          __html: "window.App=".concat(serialize_javascript__WEBPACK_IMPORTED_MODULE_2___default()(app))
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 62
        },
        __self: this
      }), scripts.map(function (script) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("script", {
          key: script,
          src: script,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 65
          },
          __self: this
        });
      }), _config__WEBPACK_IMPORTED_MODULE_3___default.a.analytics.googleTrackingId && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("script", {
        dangerouslySetInnerHTML: {
          __html: 'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' + "ga('create','".concat(_config__WEBPACK_IMPORTED_MODULE_3___default.a.analytics.googleTrackingId, "','auto');ga('send','pageview')")
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 67
        },
        __self: this
      }), _config__WEBPACK_IMPORTED_MODULE_3___default.a.analytics.googleTrackingId && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("script", {
        src: "https://www.google-analytics.com/analytics.js",
        async: true,
        defer: true,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 78
        },
        __self: this
      })));
    }
  }]);

  return Html;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

Object.defineProperty(Html, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    title: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
    description: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
    styles: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape({
      id: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
      cssText: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired
    }).isRequired),
    scripts: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired),
    app: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object,
    // eslint-disable-line
    children: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired
  }
});
Object.defineProperty(Html, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    styles: [],
    scripts: []
  }
});
/* harmony default export */ __webpack_exports__["default"] = (Html);

/***/ }),

/***/ "./src/config.js":
/***/ (function(module, exports, __webpack_require__) {

/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */
if (false) {}

module.exports = {
  // Node.js app
  port: process.env.PORT || 3000,
  // https://expressjs.com/en/guide/behind-proxies.html
  trustProxy: process.env.TRUST_PROXY || 'loopback',
  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl: process.env.API_CLIENT_URL || '',
    // API URL to be used in the server-side code
    serverUrl: process.env.API_SERVER_URL || "http://localhost:".concat(process.env.PORT || 3000)
  },
  // Database
  databaseUrl: process.env.DATABASE_URL || 'sqlite:database.sqlite',
  // Web analytics
  analytics: {
    // https://analytics.google.com/
    googleTrackingId: process.env.GOOGLE_TRACKING_ID // UA-XXXXX-X

  },
  // Authentication
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET || 'React Starter Kit'
    },
    // https://developers.facebook.com/
    facebook: {
      id: process.env.FACEBOOK_APP_ID || '186244551745631',
      secret: process.env.FACEBOOK_APP_SECRET || 'a970ae3240ab4b9b8aae0f9f0661c6fc'
    },
    // https://cloud.google.com/console/project
    google: {
      id: process.env.GOOGLE_CLIENT_ID || '251410730550-ahcg0ou5mgfhl8hlui1urru7jn5s12km.apps.googleusercontent.com',
      secret: process.env.GOOGLE_CLIENT_SECRET || 'Y8yR9yZAhm9jQ8FKAL8QIEcd'
    },
    // https://apps.twitter.com/
    twitter: {
      key: process.env.TWITTER_CONSUMER_KEY || 'Ie20AZvLJI2lQD5Dsgxgjauns',
      secret: process.env.TWITTER_CONSUMER_SECRET || 'KTZ6cxoKnEakQCeSpZlaUCJWGAlTEBJj0y2EMkUBujA7zWSvaQ'
    }
  }
};

/***/ }),

/***/ "./src/constants/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_RUNTIME_VARIABLE", function() { return SET_RUNTIME_VARIABLE; });
/* eslint-disable import/prefer-default-export */
var SET_RUNTIME_VARIABLE = 'SET_RUNTIME_VARIABLE';

/***/ }),

/***/ "./src/createFetch.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



/**
 * Creates a wrapper function around the HTML5 Fetch API that provides
 * default arguments to fetch(...) and is intended to reduce the amount
 * of boilerplate code in the application.
 * https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch
 */
function createFetch(fetch, _ref) {
  var baseUrl = _ref.baseUrl,
      cookie = _ref.cookie;
  // NOTE: Tweak the default options to suite your application needs
  var defaults = {
    method: 'GET',
    mode: baseUrl ? 'cors' : 'same-origin',
    credentials: baseUrl ? 'include' : 'same-origin',
    headers: _objectSpread({
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }, cookie ? {
      Cookie: cookie
    } : null)
  };
  return (
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(url, options) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", url.startsWith('/api') ? fetch("".concat(baseUrl).concat(url), _objectSpread({}, defaults, options, {
                  headers: lodash__WEBPACK_IMPORTED_MODULE_0___default.a.pickBy(_objectSpread({}, defaults.headers, options && options.headers), lodash__WEBPACK_IMPORTED_MODULE_0___default.a.identity)
                })) : fetch(url, options));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }()
  );
}

/* harmony default export */ __webpack_exports__["default"] = (createFetch);

/***/ }),

/***/ "./src/reducers/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("redux");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(redux__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/reducers/user.js");
/* harmony import */ var _runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/reducers/runtime.js");



/* harmony default export */ __webpack_exports__["default"] = (Object(redux__WEBPACK_IMPORTED_MODULE_0__["combineReducers"])({
  user: _user__WEBPACK_IMPORTED_MODULE_1__["default"],
  runtime: _runtime__WEBPACK_IMPORTED_MODULE_2__["default"]
}));

/***/ }),

/***/ "./src/reducers/runtime.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return runtime; });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/constants/index.js");
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


function runtime() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _constants__WEBPACK_IMPORTED_MODULE_0__["SET_RUNTIME_VARIABLE"]:
      return _objectSpread({}, state, _defineProperty({}, action.payload.name, action.payload.value));

    default:
      return state;
  }
}

/***/ }),

/***/ "./src/reducers/user.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return user; });
function user() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    default:
      return state;
  }
}

/***/ }),

/***/ "./src/router.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var universal_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("universal-router");
/* harmony import */ var universal_router__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(universal_router__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/routes/index.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */


/* harmony default export */ __webpack_exports__["default"] = (new universal_router__WEBPACK_IMPORTED_MODULE_0___default.a(_routes__WEBPACK_IMPORTED_MODULE_1__["default"], {
  resolveRoute: function resolveRoute(context, params) {
    if (typeof context.route.load === 'function') {
      return context.route.load().then(function (action) {
        return action.default(context, params);
      });
    }

    if (typeof context.route.action === 'function') {
      return context.route.action(context, params);
    }

    return undefined;
  }
}));

/***/ }),

/***/ "./src/routes/error/ErrorPage.css":
/***/ (function(module, exports, __webpack_require__) {


    var content = __webpack_require__("./node_modules/css-loader/index.js??ref--5-rules-2!./node_modules/postcss-loader/lib/index.js??ref--5-rules-3!./src/routes/error/ErrorPage.css");
    var insertCss = __webpack_require__("./node_modules/isomorphic-style-loader/lib/insertCss.js");

    if (typeof content === 'string') {
      content = [[module.i, content, '']];
    }

    module.exports = content.locals || {};
    module.exports._getContent = function() { return content; };
    module.exports._getCss = function() { return content.toString(); };
    module.exports._insertCss = function(options) { return insertCss(content, options) };
    
    // Hot Module Replacement
    // https://webpack.github.io/docs/hot-module-replacement
    // Only activated in browser context
    if (module.hot && typeof window !== 'undefined' && window.document) {
      var removeCss = function() {};
      module.hot.accept("./node_modules/css-loader/index.js??ref--5-rules-2!./node_modules/postcss-loader/lib/index.js??ref--5-rules-3!./src/routes/error/ErrorPage.css", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { (function() {
        content = __webpack_require__("./node_modules/css-loader/index.js??ref--5-rules-2!./node_modules/postcss-loader/lib/index.js??ref--5-rules-3!./src/routes/error/ErrorPage.css");

        if (typeof content === 'string') {
          content = [[module.i, content, '']];
        }

        removeCss = insertCss(content, { replace: true });
      })(__WEBPACK_OUTDATED_DEPENDENCIES__); });
      module.hot.dispose(function() { removeCss(); });
    }
  

/***/ }),

/***/ "./src/routes/error/ErrorPage.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorPageWithoutStyle", function() { return ErrorPage; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("prop-types");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var isomorphic_style_loader_lib_withStyles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("isomorphic-style-loader/lib/withStyles");
/* harmony import */ var isomorphic_style_loader_lib_withStyles__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(isomorphic_style_loader_lib_withStyles__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _ErrorPage_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/routes/error/ErrorPage.css");
/* harmony import */ var _ErrorPage_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_ErrorPage_css__WEBPACK_IMPORTED_MODULE_3__);
var _jsxFileName = "/home/alex/ElifTech-School/react-starter-kit/src/routes/error/ErrorPage.js";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





var ErrorPage =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ErrorPage, _React$Component);

  function ErrorPage() {
    _classCallCheck(this, ErrorPage);

    return _possibleConstructorReturn(this, (ErrorPage.__proto__ || Object.getPrototypeOf(ErrorPage)).apply(this, arguments));
  }

  _createClass(ErrorPage, [{
    key: "render",
    value: function render() {
      if (true && this.props.error) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 31
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 32
          },
          __self: this
        }, this.props.error.name), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("pre", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 33
          },
          __self: this
        }, this.props.error.stack));
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 39
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 40
        },
        __self: this
      }, "Error"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 41
        },
        __self: this
      }, "Sorry, a critical error occurred on this page."));
    }
  }]);

  return ErrorPage;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

Object.defineProperty(ErrorPage, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    error: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape({
      name: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
      message: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
      stack: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired
    })
  }
});
Object.defineProperty(ErrorPage, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    error: null
  }
});

/* harmony default export */ __webpack_exports__["default"] = (isomorphic_style_loader_lib_withStyles__WEBPACK_IMPORTED_MODULE_2___default()(_ErrorPage_css__WEBPACK_IMPORTED_MODULE_3___default.a)(ErrorPage));

/***/ }),

/***/ "./src/routes/error/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ErrorPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/routes/error/ErrorPage.js");
var _jsxFileName = "/home/alex/ElifTech-School/react-starter-kit/src/routes/error/index.js";

/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */



function action() {
  return {
    title: 'Demo Error',
    component: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_ErrorPage__WEBPACK_IMPORTED_MODULE_1__["default"], {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 16
      },
      __self: this
    })
  };
}

/* harmony default export */ __webpack_exports__["default"] = (action);

/***/ }),

/***/ "./src/routes/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable global-require */
// The top-level (parent) route
var routes = {
  path: '',
  // Keep in mind, routes are evaluated in order
  children: [{
    path: '',
    load: function load() {
      return Promise.all(/* import() | home */[__webpack_require__.e("home~not-found"), __webpack_require__.e("home")]).then(__webpack_require__.bind(null, "./src/routes/home/index.js"));
    }
  }, // Wildcard routes, e.g. { path: '(.*)', ... } (must go last)
  {
    path: '(.*)',
    load: function load() {
      return Promise.all(/* import() | not-found */[__webpack_require__.e("home~not-found"), __webpack_require__.e("not-found")]).then(__webpack_require__.bind(null, "./src/routes/not-found/index.js"));
    }
  }],
  action: function () {
    var _action = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(_ref) {
      var next, route;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              next = _ref.next;
              _context.next = 3;
              return next();

            case 3:
              route = _context.sent;
              // Provide default values for title, description etc.
              route.title = "".concat(route.title || 'Untitled Page', " - www.reactstarterkit.com");
              route.description = route.description || '';
              return _context.abrupt("return", route);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function action(_x) {
      return _action.apply(this, arguments);
    };
  }()
}; // The error page is available by permanent url for development mode

if (true) {
  routes.children.unshift({
    path: '/error',
    action: __webpack_require__("./src/routes/error/index.js").default
  });
}

/* harmony default export */ __webpack_exports__["default"] = (routes);

/***/ }),

/***/ "./src/server.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var cookie_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("cookie-parser");
/* harmony import */ var cookie_parser__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(cookie_parser__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("body-parser");
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var node_fetch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("node-fetch");
/* harmony import */ var node_fetch__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(node_fetch__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("react-dom/server");
/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_dom_server__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var pretty_error__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("pretty-error");
/* harmony import */ var pretty_error__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(pretty_error__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _components_App__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/components/App.js");
/* harmony import */ var _components_Html__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/components/Html.js");
/* harmony import */ var _routes_error_ErrorPage__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./src/routes/error/ErrorPage.js");
/* harmony import */ var _routes_error_ErrorPage_css__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./src/routes/error/ErrorPage.css");
/* harmony import */ var _routes_error_ErrorPage_css__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_routes_error_ErrorPage_css__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _createFetch__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./src/createFetch.js");
/* harmony import */ var _router__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./src/router.js");
/* harmony import */ var _chunk_manifest_json__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./chunk-manifest.json");
/* harmony import */ var _chunk_manifest_json__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_chunk_manifest_json__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _store_configureStore__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("./src/store/configureStore.js");
/* harmony import */ var _actions_runtime__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("./src/actions/runtime.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("./src/config.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_config__WEBPACK_IMPORTED_MODULE_17__);
var _jsxFileName = "/home/alex/ElifTech-School/react-starter-kit/src/server.js";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */













 // import assets from './asset-manifest.json'; // eslint-disable-line import/no-unresolved

 // eslint-disable-line import/no-unresolved




process.on('unhandledRejection', function (reason, p) {
  console.error('Unhandled Rejection at:', p, 'reason:', reason); // send entire app down. Process manager will restart it

  process.exit(1);
}); //
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';
var app = express__WEBPACK_IMPORTED_MODULE_1___default()(); //
// If you are using proxy from external machine, you can set TRUST_PROXY env
// Default is to trust proxy headers only from loopback interface.
// -----------------------------------------------------------------------------

app.set('trust proxy', _config__WEBPACK_IMPORTED_MODULE_17___default.a.trustProxy); //
// Register Node.js middleware
// -----------------------------------------------------------------------------

app.use(express__WEBPACK_IMPORTED_MODULE_1___default.a.static(path__WEBPACK_IMPORTED_MODULE_0___default.a.resolve(__dirname, 'public')));
app.use(cookie_parser__WEBPACK_IMPORTED_MODULE_2___default()());
app.use(body_parser__WEBPACK_IMPORTED_MODULE_3___default.a.urlencoded({
  extended: true
}));
app.use(body_parser__WEBPACK_IMPORTED_MODULE_3___default.a.json()); //
// Register server-side rendering middleware
// -----------------------------------------------------------------------------

app.get('*',
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res, next) {
    var css, insertCss, fetch, initialState, store, context, route, data, scripts, addChunk, html;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            css = new Set(); // Enables critical path CSS rendering
            // https://github.com/kriasoft/isomorphic-style-loader

            insertCss = function insertCss() {
              for (var _len = arguments.length, styles = new Array(_len), _key = 0; _key < _len; _key++) {
                styles[_key] = arguments[_key];
              }

              // eslint-disable-next-line no-underscore-dangle
              styles.forEach(function (style) {
                return css.add(style._getCss());
              });
            }; // Universal HTTP client


            fetch = Object(_createFetch__WEBPACK_IMPORTED_MODULE_12__["default"])(node_fetch__WEBPACK_IMPORTED_MODULE_4___default.a, {
              baseUrl: _config__WEBPACK_IMPORTED_MODULE_17___default.a.api.serverUrl,
              cookie: req.headers.cookie
            });
            initialState = {
              user: req.user || null
            };
            store = Object(_store_configureStore__WEBPACK_IMPORTED_MODULE_15__["default"])(initialState, {
              fetch: fetch // I should not use `history` on server.. but how I do redirection? follow universal-router

            });
            store.dispatch(Object(_actions_runtime__WEBPACK_IMPORTED_MODULE_16__["setRuntimeVariable"])({
              name: 'initialNow',
              value: Date.now()
            })); // Global (context) variables that can be easily accessed from any React component
            // https://facebook.github.io/react/docs/context.html

            context = {
              insertCss: insertCss,
              fetch: fetch,
              // The twins below are wild, be careful!
              pathname: req.path,
              query: req.query,
              // You can access redux through react-redux connect
              store: store,
              storeSubscription: null
            };
            _context.next = 10;
            return _router__WEBPACK_IMPORTED_MODULE_13__["default"].resolve(context);

          case 10:
            route = _context.sent;

            if (!route.redirect) {
              _context.next = 14;
              break;
            }

            res.redirect(route.status || 302, route.redirect);
            return _context.abrupt("return");

          case 14:
            data = _objectSpread({}, route);
            data.children = react_dom_server__WEBPACK_IMPORTED_MODULE_6___default.a.renderToString(react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_components_App__WEBPACK_IMPORTED_MODULE_8__["default"], {
              context: context,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 117
              },
              __self: this
            }, route.component));
            data.styles = [{
              id: 'css',
              cssText: _toConsumableArray(css).join('')
            }];
            scripts = new Set();

            addChunk = function addChunk(chunk) {
              if (_chunk_manifest_json__WEBPACK_IMPORTED_MODULE_14___default.a[chunk]) {
                _chunk_manifest_json__WEBPACK_IMPORTED_MODULE_14___default.a[chunk].forEach(function (asset) {
                  return scripts.add(asset);
                });
              } else if (true) {
                throw new Error("Chunk with name '".concat(chunk, "' cannot be found"));
              }
            };

            addChunk('client');
            if (route.chunk) addChunk(route.chunk);
            if (route.chunks) route.chunks.forEach(addChunk);
            data.scripts = Array.from(scripts);
            data.app = {
              apiUrl: _config__WEBPACK_IMPORTED_MODULE_17___default.a.api.clientUrl,
              state: context.store.getState()
            };
            html = react_dom_server__WEBPACK_IMPORTED_MODULE_6___default.a.renderToStaticMarkup(react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_components_Html__WEBPACK_IMPORTED_MODULE_9__["default"], _extends({}, data, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 139
              },
              __self: this
            })));
            res.status(route.status || 200);
            res.send("<!doctype html>".concat(html));
            _context.next = 32;
            break;

          case 29:
            _context.prev = 29;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 32:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 29]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); //
// Error handling
// -----------------------------------------------------------------------------

var pe = new pretty_error__WEBPACK_IMPORTED_MODULE_7___default.a();
pe.skipNodeFiles();
pe.skipPackage('express'); // eslint-disable-next-line no-unused-vars

app.use(function (err, req, res, next) {
  console.error(pe.render(err));
  var html = react_dom_server__WEBPACK_IMPORTED_MODULE_6___default.a.renderToStaticMarkup(react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_components_Html__WEBPACK_IMPORTED_MODULE_9__["default"], {
    title: "Internal Server Error",
    description: err.message,
    styles: [{
      id: 'css',
      cssText: _routes_error_ErrorPage_css__WEBPACK_IMPORTED_MODULE_11___default.a._getCss()
    }] // eslint-disable-line no-underscore-dangle
    ,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 158
    },
    __self: this
  }, react_dom_server__WEBPACK_IMPORTED_MODULE_6___default.a.renderToString(react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_routes_error_ErrorPage__WEBPACK_IMPORTED_MODULE_10__["ErrorPageWithoutStyle"], {
    error: err,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 163
    },
    __self: this
  }))));
  res.status(err.status || 500);
  res.send("<!doctype html>".concat(html));
}); //
// Launch the server
// -----------------------------------------------------------------------------

if (false) {} //
// Hot Module Replacement
// -----------------------------------------------------------------------------


if (true) {
  app.hot = module.hot;
  module.hot.accept("./src/router.js", function() { /* harmony import */ _router__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./src/router.js");
 });
}

/* harmony default export */ __webpack_exports__["default"] = (app);

/***/ }),

/***/ "./src/store/configureStore.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return configureStore; });
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("redux");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(redux__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var redux_thunk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("redux-thunk");
/* harmony import */ var redux_thunk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(redux_thunk__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var redux_devtools_extension_developmentOnly__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("redux-devtools-extension/developmentOnly");
/* harmony import */ var redux_devtools_extension_developmentOnly__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(redux_devtools_extension_developmentOnly__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./package.json");
var _package_json__WEBPACK_IMPORTED_MODULE_3___namespace = /*#__PURE__*/Object.assign({}, _package_json__WEBPACK_IMPORTED_MODULE_3__, {"default": _package_json__WEBPACK_IMPORTED_MODULE_3__});
/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/reducers/index.js");
/* harmony import */ var _createHelpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/store/createHelpers.js");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/store/logger/logger.server.js");
/* harmony import */ var _middleware_clientMiddleware__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/store/middleware/clientMiddleware.js");








function configureStore(initialState, helpersConfig) {
  var helpers = Object(_createHelpers__WEBPACK_IMPORTED_MODULE_5__["default"])(helpersConfig);
  var middleware = [redux_thunk__WEBPACK_IMPORTED_MODULE_1___default.a.withExtraArgument(helpers), Object(_middleware_clientMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(helpers.fetch)];
  var enhancer;

  if (true) {
    middleware.push(Object(_logger__WEBPACK_IMPORTED_MODULE_6__["default"])()); // https://github.com/zalmoxisus/redux-devtools-extension#14-using-in-production

    var composeEnhancers = Object(redux_devtools_extension_developmentOnly__WEBPACK_IMPORTED_MODULE_2__["composeWithDevTools"])({
      // Options: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#options
      name: "".concat(_package_json__WEBPACK_IMPORTED_MODULE_3__["name"], "@").concat(_package_json__WEBPACK_IMPORTED_MODULE_3__["version"])
    }); // https://redux.js.org/docs/api/applyMiddleware.html

    enhancer = composeEnhancers(redux__WEBPACK_IMPORTED_MODULE_0__["applyMiddleware"].apply(void 0, middleware));
  } else {} // https://redux.js.org/docs/api/createStore.html


  var store = Object(redux__WEBPACK_IMPORTED_MODULE_0__["createStore"])(_reducers__WEBPACK_IMPORTED_MODULE_4__["default"], initialState, enhancer); // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)

  if (true) {
    module.hot.accept("./src/reducers/index.js", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _reducers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/reducers/index.js");
(function () {
      return (// eslint-disable-next-line global-require
        store.replaceReducer(__webpack_require__("./src/reducers/index.js").default)
      );
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); });
  }

  return store;
}

/***/ }),

/***/ "./src/store/createHelpers.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return createHelpers; });
function createHelpers(_ref) {
  var fetch = _ref.fetch,
      history = _ref.history;
  return {
    history: history,
    fetch: fetch
  };
}

/***/ }),

/***/ "./src/store/logger/logger.server.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return createLogger; });
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("util");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_0__);


function inspectObject(object) {
  return Object(util__WEBPACK_IMPORTED_MODULE_0__["inspect"])(object, {
    colors: true
  });
}

function singleLine(str) {
  return str.replace(/\s+/g, ' ');
}

var actionFormatters = {
  // This is used at feature/apollo branch, but it can help you when implementing Apollo
  APOLLO_QUERY_INIT: function APOLLO_QUERY_INIT(a) {
    return "queryId:".concat(a.queryId, " variables:").concat(inspectObject(a.variables), "\n   ").concat(singleLine(a.queryString));
  },
  APOLLO_QUERY_RESULT: function APOLLO_QUERY_RESULT(a) {
    return "queryId:".concat(a.queryId, "\n   ").concat(singleLine(inspectObject(a.result)));
  },
  APOLLO_QUERY_STOP: function APOLLO_QUERY_STOP(a) {
    return "queryId:".concat(a.queryId);
  }
}; // Server side redux action logger

function createLogger() {
  // eslint-disable-next-line no-unused-vars
  return function (store) {
    return function (next) {
      return function (action) {
        var formattedPayload = '';
        var actionFormatter = actionFormatters[action.type];

        if (typeof actionFormatter === 'function') {
          formattedPayload = actionFormatter(action);
        } else if (action.toString !== Object.prototype.toString) {
          formattedPayload = action.toString();
        } else if (typeof action.payload !== 'undefined') {
          formattedPayload = inspectObject(action.payload);
        } else {
          formattedPayload = inspectObject(action);
        }

        console.log(" * ".concat(action.type, ": ").concat(formattedPayload)); // eslint-disable-line no-console

        return next(action);
      };
    };
  };
}

/***/ }),

/***/ "./src/store/middleware/clientMiddleware.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return clientMiddleware; });
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function clientMiddleware(client) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState);
        }

        var promise = action.promise,
            types = action.types,
            rest = _objectWithoutProperties(action, ["promise", "types"]); // eslint-disable-line no-redeclare


        if (!promise) {
          return next(action);
        }

        var _types = _slicedToArray(types, 3),
            REQUEST = _types[0],
            SUCCESS = _types[1],
            FAILURE = _types[2];

        next(_objectSpread({}, rest, {
          type: REQUEST
        }));
        var actionPromise = promise(client);
        actionPromise.then(
        /*#__PURE__*/
        function () {
          var _ref2 = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee(res) {
            var resText, json, result;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return res.text();

                  case 2:
                    resText = _context.sent;
                    json = resText ? JSON.parse(resText) : {};

                    if (res.status >= 400) {
                      next(_objectSpread({}, rest, {
                        error: json,
                        type: FAILURE
                      }));
                    } else {
                      result = {
                        status: res.status,
                        total: Number.parseInt(res.headers.get('x-total-count'), 10) || 0,
                        json: json
                      };
                      next(_objectSpread({}, rest, {
                        result: result,
                        type: SUCCESS
                      }));
                    }

                  case 5:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          return function (_x) {
            return _ref2.apply(this, arguments);
          };
        }(), function (error) {
          return next(_objectSpread({}, rest, {
            error: error,
            type: FAILURE
          }));
        }).catch(function (error) {
          console.error('MIDDLEWARE ERROR:', error);
          next(_objectSpread({}, rest, {
            error: error,
            type: FAILURE
          }));
        });
        return actionPromise;
      };
    };
  };
}

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("@babel/polyfill");
module.exports = __webpack_require__("./src/server.js");


/***/ }),

/***/ "@babel/polyfill":
/***/ (function(module, exports) {

module.exports = require("@babel/polyfill");

/***/ }),

/***/ "babel-runtime/core-js/json/stringify":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/json/stringify");

/***/ }),

/***/ "babel-runtime/helpers/slicedToArray":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/slicedToArray");

/***/ }),

/***/ "body-parser":
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "cookie-parser":
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),

/***/ "express":
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "history/createBrowserHistory":
/***/ (function(module, exports) {

module.exports = require("history/createBrowserHistory");

/***/ }),

/***/ "isomorphic-style-loader/lib/withStyles":
/***/ (function(module, exports) {

module.exports = require("isomorphic-style-loader/lib/withStyles");

/***/ }),

/***/ "lodash":
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "node-fetch":
/***/ (function(module, exports) {

module.exports = require("node-fetch");

/***/ }),

/***/ "path":
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "pretty-error":
/***/ (function(module, exports) {

module.exports = require("pretty-error");

/***/ }),

/***/ "prop-types":
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),

/***/ "react":
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "react-dom/server":
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),

/***/ "react-redux":
/***/ (function(module, exports) {

module.exports = require("react-redux");

/***/ }),

/***/ "redux":
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),

/***/ "redux-devtools-extension/developmentOnly":
/***/ (function(module, exports) {

module.exports = require("redux-devtools-extension/developmentOnly");

/***/ }),

/***/ "redux-thunk":
/***/ (function(module, exports) {

module.exports = require("redux-thunk");

/***/ }),

/***/ "serialize-javascript":
/***/ (function(module, exports) {

module.exports = require("serialize-javascript");

/***/ }),

/***/ "universal-router":
/***/ (function(module, exports) {

module.exports = require("universal-router");

/***/ }),

/***/ "util":
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlcyI6WyIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIi9ob21lL2FsZXgvRWxpZlRlY2gtU2Nob29sL3JlYWN0LXN0YXJ0ZXIta2l0L2V4dGVybmFsIFwiLi9jaHVuay1tYW5pZmVzdC5qc29uXCIiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9zcmMvcm91dGVzL2Vycm9yL0Vycm9yUGFnZS5jc3MiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9ub2RlX21vZHVsZXMvaXNvbW9ycGhpYy1zdHlsZS1sb2FkZXIvbGliL2luc2VydENzcy5qcyIsIi9ob21lL2FsZXgvRWxpZlRlY2gtU2Nob29sL3JlYWN0LXN0YXJ0ZXIta2l0L3NyYy9hY3Rpb25zL3J1bnRpbWUuanMiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9zcmMvY29tcG9uZW50cy9BcHAuanMiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9zcmMvY29tcG9uZW50cy9IdG1sLmpzIiwiL2hvbWUvYWxleC9FbGlmVGVjaC1TY2hvb2wvcmVhY3Qtc3RhcnRlci1raXQvc3JjL2NvbmZpZy5qcyIsIi9ob21lL2FsZXgvRWxpZlRlY2gtU2Nob29sL3JlYWN0LXN0YXJ0ZXIta2l0L3NyYy9jb25zdGFudHMvaW5kZXguanMiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9zcmMvY3JlYXRlRmV0Y2guanMiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9zcmMvcmVkdWNlcnMvaW5kZXguanMiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9zcmMvcmVkdWNlcnMvcnVudGltZS5qcyIsIi9ob21lL2FsZXgvRWxpZlRlY2gtU2Nob29sL3JlYWN0LXN0YXJ0ZXIta2l0L3NyYy9yZWR1Y2Vycy91c2VyLmpzIiwiL2hvbWUvYWxleC9FbGlmVGVjaC1TY2hvb2wvcmVhY3Qtc3RhcnRlci1raXQvc3JjL3JvdXRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcm91dGVzL2Vycm9yL0Vycm9yUGFnZS5jc3M/Yjg3NCIsIi9ob21lL2FsZXgvRWxpZlRlY2gtU2Nob29sL3JlYWN0LXN0YXJ0ZXIta2l0L3NyYy9yb3V0ZXMvZXJyb3IvRXJyb3JQYWdlLmpzIiwiL2hvbWUvYWxleC9FbGlmVGVjaC1TY2hvb2wvcmVhY3Qtc3RhcnRlci1raXQvc3JjL3JvdXRlcy9lcnJvci9pbmRleC5qcyIsIi9ob21lL2FsZXgvRWxpZlRlY2gtU2Nob29sL3JlYWN0LXN0YXJ0ZXIta2l0L3NyYy9yb3V0ZXMvaW5kZXguanMiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9zcmMvc2VydmVyLmpzIiwiL2hvbWUvYWxleC9FbGlmVGVjaC1TY2hvb2wvcmVhY3Qtc3RhcnRlci1raXQvc3JjL3N0b3JlL2NvbmZpZ3VyZVN0b3JlLmpzIiwiL2hvbWUvYWxleC9FbGlmVGVjaC1TY2hvb2wvcmVhY3Qtc3RhcnRlci1raXQvc3JjL3N0b3JlL2NyZWF0ZUhlbHBlcnMuanMiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9zcmMvc3RvcmUvbG9nZ2VyL2xvZ2dlci5zZXJ2ZXIuanMiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9zcmMvc3RvcmUvbWlkZGxld2FyZS9jbGllbnRNaWRkbGV3YXJlLmpzIiwiL2hvbWUvYWxleC9FbGlmVGVjaC1TY2hvb2wvcmVhY3Qtc3RhcnRlci1raXQvZXh0ZXJuYWwgXCJAYmFiZWwvcG9seWZpbGxcIiIsIi9ob21lL2FsZXgvRWxpZlRlY2gtU2Nob29sL3JlYWN0LXN0YXJ0ZXIta2l0L2V4dGVybmFsIFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL2pzb24vc3RyaW5naWZ5XCIiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9leHRlcm5hbCBcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9zbGljZWRUb0FycmF5XCIiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9leHRlcm5hbCBcImJvZHktcGFyc2VyXCIiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9leHRlcm5hbCBcImNvb2tpZS1wYXJzZXJcIiIsIi9ob21lL2FsZXgvRWxpZlRlY2gtU2Nob29sL3JlYWN0LXN0YXJ0ZXIta2l0L2V4dGVybmFsIFwiZXhwcmVzc1wiIiwiL2hvbWUvYWxleC9FbGlmVGVjaC1TY2hvb2wvcmVhY3Qtc3RhcnRlci1raXQvZXh0ZXJuYWwgXCJoaXN0b3J5L2NyZWF0ZUJyb3dzZXJIaXN0b3J5XCIiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9leHRlcm5hbCBcImlzb21vcnBoaWMtc3R5bGUtbG9hZGVyL2xpYi93aXRoU3R5bGVzXCIiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9leHRlcm5hbCBcImxvZGFzaFwiIiwiL2hvbWUvYWxleC9FbGlmVGVjaC1TY2hvb2wvcmVhY3Qtc3RhcnRlci1raXQvZXh0ZXJuYWwgXCJub2RlLWZldGNoXCIiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9leHRlcm5hbCBcInBhdGhcIiIsIi9ob21lL2FsZXgvRWxpZlRlY2gtU2Nob29sL3JlYWN0LXN0YXJ0ZXIta2l0L2V4dGVybmFsIFwicHJldHR5LWVycm9yXCIiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9leHRlcm5hbCBcInByb3AtdHlwZXNcIiIsIi9ob21lL2FsZXgvRWxpZlRlY2gtU2Nob29sL3JlYWN0LXN0YXJ0ZXIta2l0L2V4dGVybmFsIFwicmVhY3RcIiIsIi9ob21lL2FsZXgvRWxpZlRlY2gtU2Nob29sL3JlYWN0LXN0YXJ0ZXIta2l0L2V4dGVybmFsIFwicmVhY3QtZG9tL3NlcnZlclwiIiwiL2hvbWUvYWxleC9FbGlmVGVjaC1TY2hvb2wvcmVhY3Qtc3RhcnRlci1raXQvZXh0ZXJuYWwgXCJyZWFjdC1yZWR1eFwiIiwiL2hvbWUvYWxleC9FbGlmVGVjaC1TY2hvb2wvcmVhY3Qtc3RhcnRlci1raXQvZXh0ZXJuYWwgXCJyZWR1eFwiIiwiL2hvbWUvYWxleC9FbGlmVGVjaC1TY2hvb2wvcmVhY3Qtc3RhcnRlci1raXQvZXh0ZXJuYWwgXCJyZWR1eC1kZXZ0b29scy1leHRlbnNpb24vZGV2ZWxvcG1lbnRPbmx5XCIiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9leHRlcm5hbCBcInJlZHV4LXRodW5rXCIiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9leHRlcm5hbCBcInNlcmlhbGl6ZS1qYXZhc2NyaXB0XCIiLCIvaG9tZS9hbGV4L0VsaWZUZWNoLVNjaG9vbC9yZWFjdC1zdGFydGVyLWtpdC9leHRlcm5hbCBcInVuaXZlcnNhbC1yb3V0ZXJcIiIsIi9ob21lL2FsZXgvRWxpZlRlY2gtU2Nob29sL3JlYWN0LXN0YXJ0ZXIta2l0L2V4dGVybmFsIFwidXRpbFwiIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7XG4gXHRcdHZhciBjaHVuayA9IHJlcXVpcmUoXCIuL1wiICsgXCJ1cGRhdGVzL1wiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCIpO1xuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVuay5pZCwgY2h1bmsubW9kdWxlcyk7XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRNYW5pZmVzdCgpIHtcbiBcdFx0dHJ5IHtcbiBcdFx0XHR2YXIgdXBkYXRlID0gcmVxdWlyZShcIi4vXCIgKyBcInVwZGF0ZXMvXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNvblwiKTtcbiBcdFx0fSBjYXRjaCAoZSkge1xuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiBcdFx0fVxuIFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVwZGF0ZSk7XG4gXHR9XG5cbiBcdC8vZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuXG4gXHR2YXIgaG90QXBwbHlPblVwZGF0ZSA9IHRydWU7XG4gXHR2YXIgaG90Q3VycmVudEhhc2ggPSBcImMwZmE0YjUyOGY5ZTMxMjJlZDE3XCI7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RSZXF1ZXN0VGltZW91dCA9IDEwMDAwO1xuIFx0dmFyIGhvdEN1cnJlbnRNb2R1bGVEYXRhID0ge307XG4gXHR2YXIgaG90Q3VycmVudENoaWxkTW9kdWxlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHMgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkge1xuIFx0XHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0aWYgKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XG4gXHRcdHZhciBmbiA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiBcdFx0XHRpZiAobWUuaG90LmFjdGl2ZSkge1xuIFx0XHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcbiBcdFx0XHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA9PT0gLTEpXG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xuIFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSByZXF1ZXN0O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPT09IC0xKSBtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xuIFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXG4gXHRcdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICtcbiBcdFx0XHRcdFx0XHRyZXF1ZXN0ICtcbiBcdFx0XHRcdFx0XHRcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgK1xuIFx0XHRcdFx0XHRcdG1vZHVsZUlkXG4gXHRcdFx0XHQpO1xuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XG4gXHRcdH07XG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XG4gXHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcbiBcdFx0XHRcdH0sXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9O1xuIFx0XHR9O1xuIFx0XHRmb3IgKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiZcbiBcdFx0XHRcdG5hbWUgIT09IFwiZVwiXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIE9iamVjdEZhY3RvcnkobmFtZSkpO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRmbi5lID0gZnVuY3Rpb24oY2h1bmtJZCkge1xuIFx0XHRcdGlmIChob3RTdGF0dXMgPT09IFwicmVhZHlcIikgaG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcbiBcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkKS50aGVuKGZpbmlzaENodW5rTG9hZGluZywgZnVuY3Rpb24oZXJyKSB7XG4gXHRcdFx0XHRmaW5pc2hDaHVua0xvYWRpbmcoKTtcbiBcdFx0XHRcdHRocm93IGVycjtcbiBcdFx0XHR9KTtcblxuIFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmctLTtcbiBcdFx0XHRcdGlmIChob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XG4gXHRcdFx0XHRcdGlmICghaG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdKSB7XG4gXHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XG4gXHRcdFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9O1xuIFx0XHRyZXR1cm4gZm47XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7XG4gXHRcdHZhciBob3QgPSB7XG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcbiBcdFx0XHRfbWFpbjogaG90Q3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCxcblxuIFx0XHRcdC8vIE1vZHVsZSBBUElcbiBcdFx0XHRhY3RpdmU6IHRydWUsXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRpZiAodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIikgaG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJmdW5jdGlvblwiKSBob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXG4gXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxuIFx0XHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XG4gXHRcdFx0XHRlbHNlIGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XG4gXHRcdFx0fSxcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcbiBcdFx0XHRcdGlmICh0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKSBob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxuIFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xuIFx0XHRcdH0sXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuIFx0XHRcdH0sXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0XHR9LFxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHR9LFxuXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXG4gXHRcdFx0YXBwbHk6IGhvdEFwcGx5LFxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0aWYgKCFsKSByZXR1cm4gaG90U3RhdHVzO1xuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcbiBcdFx0XHR9LFxuIFx0XHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG4gXHRcdFx0fSxcbiBcdFx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkgaG90U3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0fSxcblxuIFx0XHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxuIFx0XHR9O1xuIFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSB1bmRlZmluZWQ7XG4gXHRcdHJldHVybiBob3Q7XG4gXHR9XG5cbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xuXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcbiBcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XG4gXHR9XG5cbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90RGVmZXJyZWQ7XG5cbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcblxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xuIFx0XHR2YXIgaXNOdW1iZXIgPSAraWQgKyBcIlwiID09PSBpZDtcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XG4gXHRcdGlmIChob3RTdGF0dXMgIT09IFwiaWRsZVwiKVxuIFx0XHRcdHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdChob3RSZXF1ZXN0VGltZW91dCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcbiBcdFx0XHRpZiAoIXVwZGF0ZSkge1xuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0XHRcdHJldHVybiBudWxsO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdEF2YWlsYWJsZUZpbGVzTWFwID0gdXBkYXRlLmM7XG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xuXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XG4gXHRcdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XG4gXHRcdFx0XHR9O1xuIFx0XHRcdH0pO1xuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xuIFx0XHRcdGZvcih2YXIgY2h1bmtJZCBpbiBpbnN0YWxsZWRDaHVua3MpXG4gXHRcdFx0e1xuIFx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbGluZSBuby1sb25lLWJsb2Nrc1xuIFx0XHRcdFx0LypnbG9iYWxzIGNodW5rSWQgKi9cbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdH1cbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiICYmXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nID09PSAwICYmXG4gXHRcdFx0XHRob3RXYWl0aW5nRmlsZXMgPT09IDBcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XG4gXHRcdH0pO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7XG4gXHRcdGlmICghaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxuIFx0XHRcdHJldHVybjtcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcbiBcdFx0Zm9yICh2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdGhvdFVwZGF0ZVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmICgtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0aWYgKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XG4gXHRcdH0gZWxzZSB7XG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlcysrO1xuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcbiBcdFx0aG90U2V0U3RhdHVzKFwicmVhZHlcIik7XG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XG4gXHRcdGlmICghZGVmZXJyZWQpIHJldHVybjtcbiBcdFx0aWYgKGhvdEFwcGx5T25VcGRhdGUpIHtcbiBcdFx0XHQvLyBXcmFwIGRlZmVycmVkIG9iamVjdCBpbiBQcm9taXNlIHRvIG1hcmsgaXQgYXMgYSB3ZWxsLWhhbmRsZWQgUHJvbWlzZSB0b1xuIFx0XHRcdC8vIGF2b2lkIHRyaWdnZXJpbmcgdW5jYXVnaHQgZXhjZXB0aW9uIHdhcm5pbmcgaW4gQ2hyb21lLlxuIFx0XHRcdC8vIFNlZSBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00NjU2NjZcbiBcdFx0XHRQcm9taXNlLnJlc29sdmUoKVxuIFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24oKSB7XG4gXHRcdFx0XHRcdHJldHVybiBob3RBcHBseShob3RBcHBseU9uVXBkYXRlKTtcbiBcdFx0XHRcdH0pXG4gXHRcdFx0XHQudGhlbihcbiBcdFx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0KSB7XG4gXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xuIFx0XHRcdFx0XHR9LFxuIFx0XHRcdFx0XHRmdW5jdGlvbihlcnIpIHtcbiBcdFx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0KTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG4gXHRcdFx0Zm9yICh2YXIgaWQgaW4gaG90VXBkYXRlKSB7XG4gXHRcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHRvTW9kdWxlSWQoaWQpKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcbiBcdFx0aWYgKGhvdFN0YXR1cyAhPT0gXCJyZWFkeVwiKVxuIFx0XHRcdHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcbiBcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiBcdFx0dmFyIGNiO1xuIFx0XHR2YXIgaTtcbiBcdFx0dmFyIGo7XG4gXHRcdHZhciBtb2R1bGU7XG4gXHRcdHZhciBtb2R1bGVJZDtcblxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFt1cGRhdGVNb2R1bGVJZF07XG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG5cbiBcdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKS5tYXAoZnVuY3Rpb24oaWQpIHtcbiBcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxuIFx0XHRcdFx0XHRpZDogaWRcbiBcdFx0XHRcdH07XG4gXHRcdFx0fSk7XG4gXHRcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcbiBcdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcbiBcdFx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKSBjb250aW51ZTtcbiBcdFx0XHRcdGlmIChtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtZGVjbGluZWRcIixcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAobW9kdWxlLmhvdC5fbWFpbikge1xuIFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0dmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV07XG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcbiBcdFx0XHRcdFx0aWYgKCFwYXJlbnQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRpZiAocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcbiBcdFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmIChvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgIT09IC0xKSBjb250aW51ZTtcbiBcdFx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuIFx0XHRcdFx0XHRcdGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxuIFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XG4gXHRcdFx0XHRcdHF1ZXVlLnB1c2goe1xuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXG4gXHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cblxuIFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXG4gXHRcdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXG4gXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xuIFx0XHRcdH07XG4gXHRcdH1cblxuIFx0XHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XG4gXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHR2YXIgaXRlbSA9IGJbaV07XG4gXHRcdFx0XHRpZiAoYS5pbmRleE9mKGl0ZW0pID09PSAtMSkgYS5wdXNoKGl0ZW0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cbiBcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG4gXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcblxuIFx0XHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKCkge1xuIFx0XHRcdGNvbnNvbGUud2FybihcbiBcdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiXG4gXHRcdFx0KTtcbiBcdFx0fTtcblxuIFx0XHRmb3IgKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xuIFx0XHRcdFx0dmFyIHJlc3VsdDtcbiBcdFx0XHRcdGlmIChob3RVcGRhdGVbaWRdKSB7XG4gXHRcdFx0XHRcdHJlc3VsdCA9IGdldEFmZmVjdGVkU3R1ZmYobW9kdWxlSWQpO1xuIFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwiZGlzcG9zZWRcIixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogaWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGRvRGlzcG9zZSA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XG4gXHRcdFx0XHRpZiAocmVzdWx0LmNoYWluKSB7XG4gXHRcdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdHN3aXRjaCAocmVzdWx0LnR5cGUpIHtcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRlY2xpbmVkKSBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5tb2R1bGVJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0XCIgaW4gXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5wYXJlbnRJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0Y2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uVW5hY2NlcHRlZCkgb3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25BY2NlcHRlZCkgb3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGlzcG9zZWQpIG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGRlZmF1bHQ6XG4gXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChhYm9ydEVycm9yKSB7XG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xuIFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoYWJvcnRFcnJvcik7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoZG9BcHBseSkge1xuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IGhvdFVwZGF0ZVttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdFx0XHRcdGZvciAobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0XHRcdFx0aWYgKFxuIFx0XHRcdFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKFxuIFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMsXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkXG4gXHRcdFx0XHRcdFx0XHQpXG4gXHRcdFx0XHRcdFx0KSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XG4gXHRcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLFxuIFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGRvRGlzcG9zZSkge1xuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxuIFx0XHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XG4gXHRcdGZvciAoaSA9IDA7IGkgPCBvdXRkYXRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRtb2R1bGVJZCA9IG91dGRhdGVkTW9kdWxlc1tpXTtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJlxuIFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWRcbiBcdFx0XHQpXG4gXHRcdFx0XHRvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMucHVzaCh7XG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdGVycm9ySGFuZGxlcjogaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWRcbiBcdFx0XHRcdH0pO1xuIFx0XHR9XG5cbiBcdFx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XG4gXHRcdE9iamVjdC5rZXlzKGhvdEF2YWlsYWJsZUZpbGVzTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGNodW5rSWQpIHtcbiBcdFx0XHRpZiAoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XG4gXHRcdFx0XHRob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0fVxuIFx0XHR9KTtcblxuIFx0XHR2YXIgaWR4O1xuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcbiBcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xuIFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdGlmICghbW9kdWxlKSBjb250aW51ZTtcblxuIFx0XHRcdHZhciBkYXRhID0ge307XG5cbiBcdFx0XHQvLyBDYWxsIGRpc3Bvc2UgaGFuZGxlcnNcbiBcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xuIFx0XHRcdGZvciAoaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdGNiID0gZGlzcG9zZUhhbmRsZXJzW2pdO1xuIFx0XHRcdFx0Y2IoZGF0YSk7XG4gXHRcdFx0fVxuIFx0XHRcdGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXSA9IGRhdGE7XG5cbiBcdFx0XHQvLyBkaXNhYmxlIG1vZHVsZSAodGhpcyBkaXNhYmxlcyByZXF1aXJlcyBmcm9tIHRoaXMgbW9kdWxlKVxuIFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XG5cbiBcdFx0XHQvLyByZW1vdmUgbW9kdWxlIGZyb20gY2FjaGVcbiBcdFx0XHRkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG5cbiBcdFx0XHQvLyB3aGVuIGRpc3Bvc2luZyB0aGVyZSBpcyBubyBuZWVkIHRvIGNhbGwgZGlzcG9zZSBoYW5kbGVyXG4gXHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcblxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXG4gXHRcdFx0Zm9yIChqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xuIFx0XHRcdFx0aWYgKCFjaGlsZCkgY29udGludWU7XG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSB7XG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cbiBcdFx0dmFyIGRlcGVuZGVuY3k7XG4gXHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmIChtb2R1bGUpIHtcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcbiBcdFx0XHRcdFx0XHRpZiAoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIE5vdCBpbiBcImFwcGx5XCIgcGhhc2VcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XG5cbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xuXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxuIFx0XHRmb3IgKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xuIFx0XHRmb3IgKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZClcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKG1vZHVsZSkge1xuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xuIFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XG4gXHRcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcbiBcdFx0XHRcdFx0XHRpZiAoY2IpIHtcbiBcdFx0XHRcdFx0XHRcdGlmIChjYWxsYmFja3MuaW5kZXhPZihjYikgIT09IC0xKSBjb250aW51ZTtcbiBcdFx0XHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGNiKTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xuIFx0XHRcdFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRcdFx0XHRjYihtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XG4gXHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcbiBcdFx0Zm9yIChpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xuIFx0XHRcdG1vZHVsZUlkID0gaXRlbS5tb2R1bGU7XG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xuIFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKTtcbiBcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcdFx0XHRcdGlmICh0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xuIFx0XHRcdFx0XHR0cnkge1xuIFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JIYW5kbGVyKGVycik7XG4gXHRcdFx0XHRcdH0gY2F0Y2ggKGVycjIpIHtcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcbiBcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyMjtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxuIFx0XHRpZiAoZXJyb3IpIHtcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gXHRcdH1cblxuIFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0fSk7XG4gXHR9XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgY2h1bmtzXG4gXHQvLyBcIjBcIiBtZWFucyBcImFscmVhZHkgbG9hZGVkXCJcbiBcdHZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG4gXHRcdFwic2VydmVyXCI6IDBcbiBcdH07XG5cbiBcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgd2FzbSBtb2R1bGVzXG4gXHR2YXIgaW5zdGFsbGVkV2FzbU1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aG90OiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpLFxuIFx0XHRcdHBhcmVudHM6IChob3RDdXJyZW50UGFyZW50c1RlbXAgPSBob3RDdXJyZW50UGFyZW50cywgaG90Q3VycmVudFBhcmVudHMgPSBbXSwgaG90Q3VycmVudFBhcmVudHNUZW1wKSxcbiBcdFx0XHRjaGlsZHJlbjogW11cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkpO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuIFx0Ly8gVGhpcyBmaWxlIGNvbnRhaW5zIG9ubHkgdGhlIGVudHJ5IGNodW5rLlxuIFx0Ly8gVGhlIGNodW5rIGxvYWRpbmcgZnVuY3Rpb24gZm9yIGFkZGl0aW9uYWwgY2h1bmtzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmUgPSBmdW5jdGlvbiByZXF1aXJlRW5zdXJlKGNodW5rSWQpIHtcbiBcdFx0dmFyIHByb21pc2VzID0gW107XG5cblxuIFx0XHQvLyByZXF1aXJlKCkgY2h1bmsgbG9hZGluZyBmb3IgamF2YXNjcmlwdFxuXG4gXHRcdC8vIFwiMFwiIGlzIHRoZSBzaWduYWwgZm9yIFwiYWxyZWFkeSBsb2FkZWRcIlxuIFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gIT09IDApIHtcbiBcdFx0XHR2YXIgY2h1bmsgPSByZXF1aXJlKFwiLi9jaHVua3MvXCIgKyAoe1wiaG9tZX5ub3QtZm91bmRcIjpcImhvbWV+bm90LWZvdW5kXCIsXCJob21lXCI6XCJob21lXCIsXCJub3QtZm91bmRcIjpcIm5vdC1mb3VuZFwifVtjaHVua0lkXXx8Y2h1bmtJZCkgKyBcIi5qc1wiKTtcbiBcdFx0XHR2YXIgbW9yZU1vZHVsZXMgPSBjaHVuay5tb2R1bGVzLCBjaHVua0lkcyA9IGNodW5rLmlkcztcbiBcdFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKVxuIFx0XHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRzW2ldXSA9IDA7XG4gXHRcdH1cbiBcdFx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiBcdH07XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2Fzc2V0cy9cIjtcblxuIFx0Ly8gdW5jYXVnaHQgZXJyb3IgaGFuZGxlciBmb3Igd2VicGFjayBydW50aW1lXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm9lID0gZnVuY3Rpb24oZXJyKSB7XG4gXHRcdHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKSB7XG4gXHRcdFx0dGhyb3cgZXJyOyAvLyBjYXRjaCB0aGlzIGVycm9yIGJ5IHVzaW5nIGltcG9ydCgpLmNhdGNoKClcbiBcdFx0fSk7XG4gXHR9O1xuXG4gXHQvLyBvYmplY3Qgd2l0aCBhbGwgY29tcGlsZWQgV2ViQXNzZW1ibHkuTW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy53ID0ge307XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gaG90Q3JlYXRlUmVxdWlyZSgwKShfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vY2h1bmstbWFuaWZlc3QuanNvblwiKTsiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHRydWUpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLyoqXFxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxcbiAqXFxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxcbiAqXFxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXFxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cXG4gKi9cXG5cXG5odG1sIHtcXG4gIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIC1tcy1mbGV4LWFsaWduOiBjZW50ZXI7XFxuICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIC1tcy1mbGV4LXBhY2s6IGNlbnRlcjtcXG4gICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHBhZGRpbmc6IDAgMzJweDtcXG4gIHBhZGRpbmc6IDAgMnJlbTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgY29sb3I6ICM4ODg7XFxufVxcblxcbmJvZHkge1xcbiAgbWFyZ2luOiAwO1xcbn1cXG5cXG5oMSB7XFxuICBmb250LXdlaWdodDogNDAwO1xcbiAgY29sb3I6ICM1NTU7XFxufVxcblxcbnByZSB7XFxuICB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XFxuICB0ZXh0LWFsaWduOiBsZWZ0O1xcbn1cXG5cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiL2hvbWUvYWxleC9FbGlmVGVjaC1TY2hvb2wvcmVhY3Qtc3RhcnRlci1raXQvc3JjL3JvdXRlcy9lcnJvci9FcnJvclBhZ2UuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBOzs7Ozs7O0dBT0c7O0FBRUg7RUFDRSxxQkFBcUI7RUFDckIsY0FBYztFQUNkLHVCQUF1QjtNQUNuQixvQkFBb0I7RUFDeEIsc0JBQXNCO01BQ2xCLHdCQUF3QjtFQUM1QixnQkFBZ0I7RUFDaEIsZ0JBQWdCO0VBQ2hCLGFBQWE7RUFDYix3QkFBd0I7RUFDeEIsbUJBQW1CO0VBQ25CLFlBQVk7Q0FDYjs7QUFFRDtFQUNFLFVBQVU7Q0FDWDs7QUFFRDtFQUNFLGlCQUFpQjtFQUNqQixZQUFZO0NBQ2I7O0FBRUQ7RUFDRSxzQkFBc0I7RUFDdEIsaUJBQWlCO0NBQ2xCXCIsXCJmaWxlXCI6XCJFcnJvclBhZ2UuY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qKlxcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcXG4gKlxcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cXG4gKlxcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXFxuICovXFxuXFxuaHRtbCB7XFxuICBkaXNwbGF5OiAtbXMtZmxleGJveDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICAtbXMtZmxleC1hbGlnbjogY2VudGVyO1xcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAtbXMtZmxleC1wYWNrOiBjZW50ZXI7XFxuICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBwYWRkaW5nOiAwIDMycHg7XFxuICBwYWRkaW5nOiAwIDJyZW07XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGNvbG9yOiAjODg4O1xcbn1cXG5cXG5ib2R5IHtcXG4gIG1hcmdpbjogMDtcXG59XFxuXFxuaDEge1xcbiAgZm9udC13ZWlnaHQ6IDQwMDtcXG4gIGNvbG9yOiAjNTU1O1xcbn1cXG5cXG5wcmUge1xcbiAgd2hpdGUtc3BhY2U6IHByZS13cmFwO1xcbiAgdGV4dC1hbGlnbjogbGVmdDtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbi8vIGV4cG9ydHNcbiIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1c2VTb3VyY2VNYXApIHtcblx0dmFyIGxpc3QgPSBbXTtcblxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApO1xuXHRcdFx0aWYoaXRlbVsyXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBjb250ZW50ICsgXCJ9XCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY29udGVudDtcblx0XHRcdH1cblx0XHR9KS5qb2luKFwiXCIpO1xuXHR9O1xuXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG5cdFx0fVxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0cmV0dXJuIGxpc3Q7XG59O1xuXG5mdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgY29udGVudCA9IGl0ZW1bMV0gfHwgJyc7XG5cdHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblx0aWYgKCFjc3NNYXBwaW5nKSB7XG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cblxuXHRpZiAodXNlU291cmNlTWFwICYmIHR5cGVvZiBidG9hID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0dmFyIHNvdXJjZU1hcHBpbmcgPSB0b0NvbW1lbnQoY3NzTWFwcGluZyk7XG5cdFx0dmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcblx0XHRcdHJldHVybiAnLyojIHNvdXJjZVVSTD0nICsgY3NzTWFwcGluZy5zb3VyY2VSb290ICsgc291cmNlICsgJyAqLydcblx0XHR9KTtcblxuXHRcdHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oJ1xcbicpO1xuXHR9XG5cblx0cmV0dXJuIFtjb250ZW50XS5qb2luKCdcXG4nKTtcbn1cblxuLy8gQWRhcHRlZCBmcm9tIGNvbnZlcnQtc291cmNlLW1hcCAoTUlUKVxuZnVuY3Rpb24gdG9Db21tZW50KHNvdXJjZU1hcCkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcblx0dmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSk7XG5cdHZhciBkYXRhID0gJ3NvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCcgKyBiYXNlNjQ7XG5cblx0cmV0dXJuICcvKiMgJyArIGRhdGEgKyAnICovJztcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9zdHJpbmdpZnkgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvanNvbi9zdHJpbmdpZnknKTtcblxudmFyIF9zdHJpbmdpZnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RyaW5naWZ5KTtcblxudmFyIF9zbGljZWRUb0FycmF5MiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9zbGljZWRUb0FycmF5Jyk7XG5cbnZhciBfc2xpY2VkVG9BcnJheTMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zbGljZWRUb0FycmF5Mik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogSXNvbW9ycGhpYyBDU1Mgc3R5bGUgbG9hZGVyIGZvciBXZWJwYWNrXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTUtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcHJlZml4ID0gJ3MnO1xudmFyIGluc2VydGVkID0ge307XG5cbi8vIEJhc2U2NCBlbmNvZGluZyBhbmQgZGVjb2RpbmcgLSBUaGUgXCJVbmljb2RlIFByb2JsZW1cIlxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dpbmRvd0Jhc2U2NC9CYXNlNjRfZW5jb2RpbmdfYW5kX2RlY29kaW5nI1RoZV9Vbmljb2RlX1Byb2JsZW1cbmZ1bmN0aW9uIGI2NEVuY29kZVVuaWNvZGUoc3RyKSB7XG4gIHJldHVybiBidG9hKGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoLyUoWzAtOUEtRl17Mn0pL2csIGZ1bmN0aW9uIChtYXRjaCwgcDEpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgnMHgnICsgcDEpO1xuICB9KSk7XG59XG5cbi8qKlxuICogUmVtb3ZlIHN0eWxlL2xpbmsgZWxlbWVudHMgZm9yIHNwZWNpZmllZCBub2RlIElEc1xuICogaWYgdGhleSBhcmUgbm8gbG9uZ2VyIHJlZmVyZW5jZWQgYnkgVUkgY29tcG9uZW50cy5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQ3NzKGlkcykge1xuICBpZHMuZm9yRWFjaChmdW5jdGlvbiAoaWQpIHtcbiAgICBpZiAoLS1pbnNlcnRlZFtpZF0gPD0gMCkge1xuICAgICAgdmFyIGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcmVmaXggKyBpZCk7XG4gICAgICBpZiAoZWxlbSkge1xuICAgICAgICBlbGVtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBFeGFtcGxlOlxuICogICAvLyBJbnNlcnQgQ1NTIHN0eWxlcyBvYmplY3QgZ2VuZXJhdGVkIGJ5IGBjc3MtbG9hZGVyYCBpbnRvIERPTVxuICogICB2YXIgcmVtb3ZlQ3NzID0gaW5zZXJ0Q3NzKFtbMSwgJ2JvZHkgeyBjb2xvcjogcmVkOyB9J11dKTtcbiAqXG4gKiAgIC8vIFJlbW92ZSBpdCBmcm9tIHRoZSBET01cbiAqICAgcmVtb3ZlQ3NzKCk7XG4gKi9cbmZ1bmN0aW9uIGluc2VydENzcyhzdHlsZXMpIHtcbiAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9LFxuICAgICAgX3JlZiRyZXBsYWNlID0gX3JlZi5yZXBsYWNlLFxuICAgICAgcmVwbGFjZSA9IF9yZWYkcmVwbGFjZSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfcmVmJHJlcGxhY2UsXG4gICAgICBfcmVmJHByZXBlbmQgPSBfcmVmLnByZXBlbmQsXG4gICAgICBwcmVwZW5kID0gX3JlZiRwcmVwZW5kID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IF9yZWYkcHJlcGVuZDtcblxuICB2YXIgaWRzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIF9zdHlsZXMkaSA9ICgwLCBfc2xpY2VkVG9BcnJheTMuZGVmYXVsdCkoc3R5bGVzW2ldLCA0KSxcbiAgICAgICAgbW9kdWxlSWQgPSBfc3R5bGVzJGlbMF0sXG4gICAgICAgIGNzcyA9IF9zdHlsZXMkaVsxXSxcbiAgICAgICAgbWVkaWEgPSBfc3R5bGVzJGlbMl0sXG4gICAgICAgIHNvdXJjZU1hcCA9IF9zdHlsZXMkaVszXTtcblxuICAgIHZhciBpZCA9IG1vZHVsZUlkICsgJy0nICsgaTtcblxuICAgIGlkcy5wdXNoKGlkKTtcblxuICAgIGlmIChpbnNlcnRlZFtpZF0pIHtcbiAgICAgIGlmICghcmVwbGFjZSkge1xuICAgICAgICBpbnNlcnRlZFtpZF0rKztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW5zZXJ0ZWRbaWRdID0gMTtcblxuICAgIHZhciBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJlZml4ICsgaWQpO1xuICAgIHZhciBjcmVhdGUgPSBmYWxzZTtcblxuICAgIGlmICghZWxlbSkge1xuICAgICAgY3JlYXRlID0gdHJ1ZTtcblxuICAgICAgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuICAgICAgZWxlbS5pZCA9IHByZWZpeCArIGlkO1xuXG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ21lZGlhJywgbWVkaWEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjc3NUZXh0ID0gY3NzO1xuICAgIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIHNraXAgSUU5IGFuZCBiZWxvdywgc2VlIGh0dHA6Ly9jYW5pdXNlLmNvbS9hdG9iLWJ0b2FcbiAgICAgIGNzc1RleHQgKz0gJ1xcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsJyArIGI2NEVuY29kZVVuaWNvZGUoKDAsIF9zdHJpbmdpZnkyLmRlZmF1bHQpKHNvdXJjZU1hcCkpICsgJyovJztcbiAgICAgIGNzc1RleHQgKz0gJ1xcbi8qIyBzb3VyY2VVUkw9JyArIHNvdXJjZU1hcC5maWxlICsgJz8nICsgaWQgKyAnKi8nO1xuICAgIH1cblxuICAgIGlmICgndGV4dENvbnRlbnQnIGluIGVsZW0pIHtcbiAgICAgIGVsZW0udGV4dENvbnRlbnQgPSBjc3NUZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzc1RleHQ7XG4gICAgfVxuXG4gICAgaWYgKGNyZWF0ZSkge1xuICAgICAgaWYgKHByZXBlbmQpIHtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5pbnNlcnRCZWZvcmUoZWxlbSwgZG9jdW1lbnQuaGVhZC5jaGlsZE5vZGVzWzBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZWxlbSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlbW92ZUNzcy5iaW5kKG51bGwsIGlkcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0Q3NzOyIsIi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9wcmVmZXItZGVmYXVsdC1leHBvcnQgKi9cblxuaW1wb3J0IHsgU0VUX1JVTlRJTUVfVkFSSUFCTEUgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0UnVudGltZVZhcmlhYmxlKHsgbmFtZSwgdmFsdWUgfSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFNFVF9SVU5USU1FX1ZBUklBQkxFLFxuICAgIHBheWxvYWQ6IHtcbiAgICAgIG5hbWUsXG4gICAgICB2YWx1ZSxcbiAgICB9LFxuICB9O1xufVxuIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IFByb3ZpZGVyIGFzIFJlZHV4UHJvdmlkZXIgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5cbmNvbnN0IENvbnRleHRUeXBlID0ge1xuICAvLyBFbmFibGVzIGNyaXRpY2FsIHBhdGggQ1NTIHJlbmRlcmluZ1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20va3JpYXNvZnQvaXNvbW9ycGhpYy1zdHlsZS1sb2FkZXJcbiAgaW5zZXJ0Q3NzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAvLyBVbml2ZXJzYWwgSFRUUCBjbGllbnRcbiAgZmV0Y2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHBhdGhuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHF1ZXJ5OiBQcm9wVHlwZXMub2JqZWN0LFxuICAvLyBJbnRlZ3JhdGUgUmVkdXhcbiAgLy8gaHR0cDovL3JlZHV4LmpzLm9yZy9kb2NzL2Jhc2ljcy9Vc2FnZVdpdGhSZWFjdC5odG1sXG4gIC4uLlJlZHV4UHJvdmlkZXIuY2hpbGRDb250ZXh0VHlwZXMsXG59O1xuXG4vKipcbiAqIFRoZSB0b3AtbGV2ZWwgUmVhY3QgY29tcG9uZW50IHNldHRpbmcgY29udGV4dCAoZ2xvYmFsKSB2YXJpYWJsZXNcbiAqIHRoYXQgY2FuIGJlIGFjY2Vzc2VkIGZyb20gYWxsIHRoZSBjaGlsZCBjb21wb25lbnRzLlxuICpcbiAqIGh0dHBzOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L2RvY3MvY29udGV4dC5odG1sXG4gKlxuICogVXNhZ2UgZXhhbXBsZTpcbiAqXG4gKiAgIGNvbnN0IGNvbnRleHQgPSB7XG4gKiAgICAgaGlzdG9yeTogY3JlYXRlQnJvd3Nlckhpc3RvcnkoKSxcbiAqICAgICBzdG9yZTogY3JlYXRlU3RvcmUoKSxcbiAqICAgfTtcbiAqXG4gKiAgIFJlYWN0RE9NLnJlbmRlcihcbiAqICAgICA8QXBwIGNvbnRleHQ9e2NvbnRleHR9PlxuICogICAgICAgPExheW91dD5cbiAqICAgICAgICAgPExhbmRpbmdQYWdlIC8+XG4gKiAgICAgICA8L0xheW91dD5cbiAqICAgICA8L0FwcD4sXG4gKiAgICAgY29udGFpbmVyLFxuICogICApO1xuICovXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5QdXJlQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjb250ZXh0OiBQcm9wVHlwZXMuc2hhcGUoQ29udGV4dFR5cGUpLmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWQsXG4gIH07XG5cbiAgc3RhdGljIGNoaWxkQ29udGV4dFR5cGVzID0gQ29udGV4dFR5cGU7XG5cbiAgZ2V0Q2hpbGRDb250ZXh0KCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmNvbnRleHQ7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgLy8gTk9URTogSWYgeW91IG5lZWQgdG8gYWRkIG9yIG1vZGlmeSBoZWFkZXIsIGZvb3RlciBldGMuIG9mIHRoZSBhcHAsXG4gICAgLy8gcGxlYXNlIGRvIHRoYXQgaW5zaWRlIHRoZSBMYXlvdXQgY29tcG9uZW50LlxuICAgIHJldHVybiBSZWFjdC5DaGlsZHJlbi5vbmx5KHRoaXMucHJvcHMuY2hpbGRyZW4pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcDtcbiIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc2VyaWFsaXplIGZyb20gJ3NlcmlhbGl6ZS1qYXZhc2NyaXB0JztcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnJztcblxuLyogZXNsaW50LWRpc2FibGUgcmVhY3Qvbm8tZGFuZ2VyICovXG5cbmNsYXNzIEh0bWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgZGVzY3JpcHRpb246IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBzdHlsZXM6IFByb3BUeXBlcy5hcnJheU9mKFxuICAgICAgUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgY3NzVGV4dDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICApLFxuICAgIHNjcmlwdHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCksXG4gICAgYXBwOiBQcm9wVHlwZXMub2JqZWN0LCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHN0eWxlczogW10sXG4gICAgc2NyaXB0czogW10sXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgdGl0bGUsIGRlc2NyaXB0aW9uLCBzdHlsZXMsIHNjcmlwdHMsIGFwcCwgY2hpbGRyZW4gfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxodG1sIGNsYXNzTmFtZT1cIm5vLWpzXCIgbGFuZz1cImVuXCI+XG4gICAgICAgIDxoZWFkPlxuICAgICAgICAgIDxtZXRhIGNoYXJTZXQ9XCJ1dGYtOFwiIC8+XG4gICAgICAgICAgPG1ldGEgaHR0cEVxdWl2PVwieC11YS1jb21wYXRpYmxlXCIgY29udGVudD1cImllPWVkZ2VcIiAvPlxuICAgICAgICAgIDx0aXRsZT57dGl0bGV9PC90aXRsZT5cbiAgICAgICAgICA8bWV0YSBuYW1lPVwiZGVzY3JpcHRpb25cIiBjb250ZW50PXtkZXNjcmlwdGlvbn0gLz5cbiAgICAgICAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTFcIiAvPlxuICAgICAgICAgIHtzY3JpcHRzLm1hcChzY3JpcHQgPT4gKFxuICAgICAgICAgICAgPGxpbmsga2V5PXtzY3JpcHR9IHJlbD1cInByZWxvYWRcIiBocmVmPXtzY3JpcHR9IGFzPVwic2NyaXB0XCIgLz5cbiAgICAgICAgICApKX1cbiAgICAgICAgICA8bGluayByZWw9XCJtYW5pZmVzdFwiIGhyZWY9XCIvc2l0ZS53ZWJtYW5pZmVzdFwiIC8+XG4gICAgICAgICAgPGxpbmsgcmVsPVwiYXBwbGUtdG91Y2gtaWNvblwiIGhyZWY9XCIvaWNvbi5wbmdcIiAvPlxuICAgICAgICAgIHtzdHlsZXMubWFwKHN0eWxlID0+IChcbiAgICAgICAgICAgIDxzdHlsZVxuICAgICAgICAgICAgICBrZXk9e3N0eWxlLmlkfVxuICAgICAgICAgICAgICBpZD17c3R5bGUuaWR9XG4gICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogc3R5bGUuY3NzVGV4dCB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9oZWFkPlxuICAgICAgICA8Ym9keT5cbiAgICAgICAgICA8ZGl2IGlkPVwiYXBwXCIgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBjaGlsZHJlbiB9fSAvPlxuICAgICAgICAgIDxzY3JpcHRcbiAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogYHdpbmRvdy5BcHA9JHtzZXJpYWxpemUoYXBwKX1gIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7c2NyaXB0cy5tYXAoc2NyaXB0ID0+IDxzY3JpcHQga2V5PXtzY3JpcHR9IHNyYz17c2NyaXB0fSAvPil9XG4gICAgICAgICAge2NvbmZpZy5hbmFseXRpY3MuZ29vZ2xlVHJhY2tpbmdJZCAmJiAoXG4gICAgICAgICAgICA8c2NyaXB0XG4gICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7XG4gICAgICAgICAgICAgICAgX19odG1sOlxuICAgICAgICAgICAgICAgICAgJ3dpbmRvdy5nYT1mdW5jdGlvbigpe2dhLnEucHVzaChhcmd1bWVudHMpfTtnYS5xPVtdO2dhLmw9K25ldyBEYXRlOycgK1xuICAgICAgICAgICAgICAgICAgYGdhKCdjcmVhdGUnLCcke1xuICAgICAgICAgICAgICAgICAgICBjb25maWcuYW5hbHl0aWNzLmdvb2dsZVRyYWNraW5nSWRcbiAgICAgICAgICAgICAgICAgIH0nLCdhdXRvJyk7Z2EoJ3NlbmQnLCdwYWdldmlldycpYCxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7Y29uZmlnLmFuYWx5dGljcy5nb29nbGVUcmFja2luZ0lkICYmIChcbiAgICAgICAgICAgIDxzY3JpcHRcbiAgICAgICAgICAgICAgc3JjPVwiaHR0cHM6Ly93d3cuZ29vZ2xlLWFuYWx5dGljcy5jb20vYW5hbHl0aWNzLmpzXCJcbiAgICAgICAgICAgICAgYXN5bmNcbiAgICAgICAgICAgICAgZGVmZXJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9ib2R5PlxuICAgICAgPC9odG1sPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSHRtbDtcbiIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuXG5pZiAocHJvY2Vzcy5lbnYuQlJPV1NFUikge1xuICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgJ0RvIG5vdCBpbXBvcnQgYGNvbmZpZy5qc2AgZnJvbSBpbnNpZGUgdGhlIGNsaWVudC1zaWRlIGNvZGUuJyxcbiAgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIE5vZGUuanMgYXBwXG4gIHBvcnQ6IHByb2Nlc3MuZW52LlBPUlQgfHwgMzAwMCxcblxuICAvLyBodHRwczovL2V4cHJlc3Nqcy5jb20vZW4vZ3VpZGUvYmVoaW5kLXByb3hpZXMuaHRtbFxuICB0cnVzdFByb3h5OiBwcm9jZXNzLmVudi5UUlVTVF9QUk9YWSB8fCAnbG9vcGJhY2snLFxuXG4gIC8vIEFQSSBHYXRld2F5XG4gIGFwaToge1xuICAgIC8vIEFQSSBVUkwgdG8gYmUgdXNlZCBpbiB0aGUgY2xpZW50LXNpZGUgY29kZVxuICAgIGNsaWVudFVybDogcHJvY2Vzcy5lbnYuQVBJX0NMSUVOVF9VUkwgfHwgJycsXG4gICAgLy8gQVBJIFVSTCB0byBiZSB1c2VkIGluIHRoZSBzZXJ2ZXItc2lkZSBjb2RlXG4gICAgc2VydmVyVXJsOlxuICAgICAgcHJvY2Vzcy5lbnYuQVBJX1NFUlZFUl9VUkwgfHxcbiAgICAgIGBodHRwOi8vbG9jYWxob3N0OiR7cHJvY2Vzcy5lbnYuUE9SVCB8fCAzMDAwfWAsXG4gIH0sXG5cbiAgLy8gRGF0YWJhc2VcbiAgZGF0YWJhc2VVcmw6IHByb2Nlc3MuZW52LkRBVEFCQVNFX1VSTCB8fCAnc3FsaXRlOmRhdGFiYXNlLnNxbGl0ZScsXG5cbiAgLy8gV2ViIGFuYWx5dGljc1xuICBhbmFseXRpY3M6IHtcbiAgICAvLyBodHRwczovL2FuYWx5dGljcy5nb29nbGUuY29tL1xuICAgIGdvb2dsZVRyYWNraW5nSWQ6IHByb2Nlc3MuZW52LkdPT0dMRV9UUkFDS0lOR19JRCwgLy8gVUEtWFhYWFgtWFxuICB9LFxuXG4gIC8vIEF1dGhlbnRpY2F0aW9uXG4gIGF1dGg6IHtcbiAgICBqd3Q6IHsgc2VjcmV0OiBwcm9jZXNzLmVudi5KV1RfU0VDUkVUIHx8ICdSZWFjdCBTdGFydGVyIEtpdCcgfSxcblxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVycy5mYWNlYm9vay5jb20vXG4gICAgZmFjZWJvb2s6IHtcbiAgICAgIGlkOiBwcm9jZXNzLmVudi5GQUNFQk9PS19BUFBfSUQgfHwgJzE4NjI0NDU1MTc0NTYzMScsXG4gICAgICBzZWNyZXQ6XG4gICAgICAgIHByb2Nlc3MuZW52LkZBQ0VCT09LX0FQUF9TRUNSRVQgfHwgJ2E5NzBhZTMyNDBhYjRiOWI4YWFlMGY5ZjA2NjFjNmZjJyxcbiAgICB9LFxuXG4gICAgLy8gaHR0cHM6Ly9jbG91ZC5nb29nbGUuY29tL2NvbnNvbGUvcHJvamVjdFxuICAgIGdvb2dsZToge1xuICAgICAgaWQ6XG4gICAgICAgIHByb2Nlc3MuZW52LkdPT0dMRV9DTElFTlRfSUQgfHxcbiAgICAgICAgJzI1MTQxMDczMDU1MC1haGNnMG91NW1nZmhsOGhsdWkxdXJydTdqbjVzMTJrbS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbScsXG4gICAgICBzZWNyZXQ6IHByb2Nlc3MuZW52LkdPT0dMRV9DTElFTlRfU0VDUkVUIHx8ICdZOHlSOXlaQWhtOWpROEZLQUw4UUlFY2QnLFxuICAgIH0sXG5cbiAgICAvLyBodHRwczovL2FwcHMudHdpdHRlci5jb20vXG4gICAgdHdpdHRlcjoge1xuICAgICAga2V5OiBwcm9jZXNzLmVudi5UV0lUVEVSX0NPTlNVTUVSX0tFWSB8fCAnSWUyMEFadkxKSTJsUUQ1RHNneGdqYXVucycsXG4gICAgICBzZWNyZXQ6XG4gICAgICAgIHByb2Nlc3MuZW52LlRXSVRURVJfQ09OU1VNRVJfU0VDUkVUIHx8XG4gICAgICAgICdLVFo2Y3hvS25FYWtRQ2VTcFpsYVVDSldHQWxURUJKajB5MkVNa1VCdWpBN3pXU3ZhUScsXG4gICAgfSxcbiAgfSxcbn07XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvcHJlZmVyLWRlZmF1bHQtZXhwb3J0ICovXG5cbmV4cG9ydCBjb25zdCBTRVRfUlVOVElNRV9WQVJJQUJMRSA9ICdTRVRfUlVOVElNRV9WQVJJQUJMRSc7XG4iLCIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG50eXBlIEZldGNoID0gKHVybDogc3RyaW5nLCBvcHRpb25zOiA/YW55KSA9PiBQcm9taXNlPGFueT47XG5cbnR5cGUgT3B0aW9ucyA9IHtcbiAgYmFzZVVybDogc3RyaW5nLFxuICBjb29raWU/OiBzdHJpbmcsXG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSB3cmFwcGVyIGZ1bmN0aW9uIGFyb3VuZCB0aGUgSFRNTDUgRmV0Y2ggQVBJIHRoYXQgcHJvdmlkZXNcbiAqIGRlZmF1bHQgYXJndW1lbnRzIHRvIGZldGNoKC4uLikgYW5kIGlzIGludGVuZGVkIHRvIHJlZHVjZSB0aGUgYW1vdW50XG4gKiBvZiBib2lsZXJwbGF0ZSBjb2RlIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2RvY3MvV2ViL0FQSS9GZXRjaF9BUEkvVXNpbmdfRmV0Y2hcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRmV0Y2goZmV0Y2g6IEZldGNoLCB7IGJhc2VVcmwsIGNvb2tpZSB9OiBPcHRpb25zKSB7XG4gIC8vIE5PVEU6IFR3ZWFrIHRoZSBkZWZhdWx0IG9wdGlvbnMgdG8gc3VpdGUgeW91ciBhcHBsaWNhdGlvbiBuZWVkc1xuICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIG1vZGU6IGJhc2VVcmwgPyAnY29ycycgOiAnc2FtZS1vcmlnaW4nLFxuICAgIGNyZWRlbnRpYWxzOiBiYXNlVXJsID8gJ2luY2x1ZGUnIDogJ3NhbWUtb3JpZ2luJyxcbiAgICBoZWFkZXJzOiB7XG4gICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAuLi4oY29va2llID8geyBDb29raWU6IGNvb2tpZSB9IDogbnVsbCksXG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4gYXN5bmMgKHVybDogc3RyaW5nLCBvcHRpb25zOiBhbnkpID0+XG4gICAgdXJsLnN0YXJ0c1dpdGgoJy9hcGknKVxuICAgICAgPyBmZXRjaChgJHtiYXNlVXJsfSR7dXJsfWAsIHtcbiAgICAgICAgICAuLi5kZWZhdWx0cyxcbiAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgIGhlYWRlcnM6IF8ucGlja0J5KFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAuLi5kZWZhdWx0cy5oZWFkZXJzLFxuICAgICAgICAgICAgICAuLi4ob3B0aW9ucyAmJiBvcHRpb25zLmhlYWRlcnMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF8uaWRlbnRpdHksXG4gICAgICAgICAgKSxcbiAgICAgICAgfSlcbiAgICAgIDogZmV0Y2godXJsLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRmV0Y2g7XG4iLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgdXNlciBmcm9tICcuL3VzZXInO1xuaW1wb3J0IHJ1bnRpbWUgZnJvbSAnLi9ydW50aW1lJztcblxuZXhwb3J0IGRlZmF1bHQgY29tYmluZVJlZHVjZXJzKHtcbiAgdXNlcixcbiAgcnVudGltZSxcbn0pO1xuIiwiaW1wb3J0IHsgU0VUX1JVTlRJTUVfVkFSSUFCTEUgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBydW50aW1lKHN0YXRlID0ge30sIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBTRVRfUlVOVElNRV9WQVJJQUJMRTpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBbYWN0aW9uLnBheWxvYWQubmFtZV06IGFjdGlvbi5wYXlsb2FkLnZhbHVlLFxuICAgICAgfTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VyKHN0YXRlID0ge30sIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgVW5pdmVyc2FsUm91dGVyIGZyb20gJ3VuaXZlcnNhbC1yb3V0ZXInO1xuaW1wb3J0IHJvdXRlcyBmcm9tICcuL3JvdXRlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBVbml2ZXJzYWxSb3V0ZXIocm91dGVzLCB7XG4gIHJlc29sdmVSb3V0ZShjb250ZXh0LCBwYXJhbXMpIHtcbiAgICBpZiAodHlwZW9mIGNvbnRleHQucm91dGUubG9hZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGNvbnRleHQucm91dGVcbiAgICAgICAgLmxvYWQoKVxuICAgICAgICAudGhlbihhY3Rpb24gPT4gYWN0aW9uLmRlZmF1bHQoY29udGV4dCwgcGFyYW1zKSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY29udGV4dC5yb3V0ZS5hY3Rpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBjb250ZXh0LnJvdXRlLmFjdGlvbihjb250ZXh0LCBwYXJhbXMpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9LFxufSk7XG4iLCJcbiAgICB2YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTUtcnVsZXMtMiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTUtcnVsZXMtMyEuL0Vycm9yUGFnZS5jc3NcIik7XG4gICAgdmFyIGluc2VydENzcyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2lzb21vcnBoaWMtc3R5bGUtbG9hZGVyL2xpYi9pbnNlcnRDc3MuanNcIik7XG5cbiAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscyB8fCB7fTtcbiAgICBtb2R1bGUuZXhwb3J0cy5fZ2V0Q29udGVudCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29udGVudDsgfTtcbiAgICBtb2R1bGUuZXhwb3J0cy5fZ2V0Q3NzID0gZnVuY3Rpb24oKSB7IHJldHVybiBjb250ZW50LnRvU3RyaW5nKCk7IH07XG4gICAgbW9kdWxlLmV4cG9ydHMuX2luc2VydENzcyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHsgcmV0dXJuIGluc2VydENzcyhjb250ZW50LCBvcHRpb25zKSB9O1xuICAgIFxuICAgIC8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbiAgICAvLyBodHRwczovL3dlYnBhY2suZ2l0aHViLmlvL2RvY3MvaG90LW1vZHVsZS1yZXBsYWNlbWVudFxuICAgIC8vIE9ubHkgYWN0aXZhdGVkIGluIGJyb3dzZXIgY29udGV4dFxuICAgIGlmIChtb2R1bGUuaG90ICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5kb2N1bWVudCkge1xuICAgICAgdmFyIHJlbW92ZUNzcyA9IGZ1bmN0aW9uKCkge307XG4gICAgICBtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tNS1ydWxlcy0yIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tNS1ydWxlcy0zIS4vRXJyb3JQYWdlLmNzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTUtcnVsZXMtMiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTUtcnVsZXMtMyEuL0Vycm9yUGFnZS5jc3NcIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUNzcyA9IGluc2VydENzcyhjb250ZW50LCB7IHJlcGxhY2U6IHRydWUgfSk7XG4gICAgICB9KTtcbiAgICAgIG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgcmVtb3ZlQ3NzKCk7IH0pO1xuICAgIH1cbiAgIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB3aXRoU3R5bGVzIGZyb20gJ2lzb21vcnBoaWMtc3R5bGUtbG9hZGVyL2xpYi93aXRoU3R5bGVzJztcbmltcG9ydCBzIGZyb20gJy4vRXJyb3JQYWdlLmNzcyc7XG5cbmNsYXNzIEVycm9yUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgZXJyb3I6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBtZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBzdGFjazogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIH0pLFxuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgZXJyb3I6IG51bGwsXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmIChfX0RFVl9fICYmIHRoaXMucHJvcHMuZXJyb3IpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGgxPnt0aGlzLnByb3BzLmVycm9yLm5hbWV9PC9oMT5cbiAgICAgICAgICA8cHJlPnt0aGlzLnByb3BzLmVycm9yLnN0YWNrfTwvcHJlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxoMT5FcnJvcjwvaDE+XG4gICAgICAgIDxwPlNvcnJ5LCBhIGNyaXRpY2FsIGVycm9yIG9jY3VycmVkIG9uIHRoaXMgcGFnZS48L3A+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCB7IEVycm9yUGFnZSBhcyBFcnJvclBhZ2VXaXRob3V0U3R5bGUgfTtcbmV4cG9ydCBkZWZhdWx0IHdpdGhTdHlsZXMocykoRXJyb3JQYWdlKTtcbiIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBFcnJvclBhZ2UgZnJvbSAnLi9FcnJvclBhZ2UnO1xuXG5mdW5jdGlvbiBhY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgdGl0bGU6ICdEZW1vIEVycm9yJyxcbiAgICBjb21wb25lbnQ6IDxFcnJvclBhZ2UgLz4sXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFjdGlvbjtcbiIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgZ2xvYmFsLXJlcXVpcmUgKi9cblxuLy8gVGhlIHRvcC1sZXZlbCAocGFyZW50KSByb3V0ZVxuY29uc3Qgcm91dGVzID0ge1xuICBwYXRoOiAnJyxcblxuICAvLyBLZWVwIGluIG1pbmQsIHJvdXRlcyBhcmUgZXZhbHVhdGVkIGluIG9yZGVyXG4gIGNoaWxkcmVuOiBbXG4gICAge1xuICAgICAgcGF0aDogJycsXG4gICAgICBsb2FkOiAoKSA9PiBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogJ2hvbWUnICovICcuL2hvbWUnKSxcbiAgICB9LFxuXG4gICAgLy8gV2lsZGNhcmQgcm91dGVzLCBlLmcuIHsgcGF0aDogJyguKiknLCAuLi4gfSAobXVzdCBnbyBsYXN0KVxuICAgIHtcbiAgICAgIHBhdGg6ICcoLiopJyxcbiAgICAgIGxvYWQ6ICgpID0+IGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAnbm90LWZvdW5kJyAqLyAnLi9ub3QtZm91bmQnKSxcbiAgICB9LFxuICBdLFxuXG4gIGFzeW5jIGFjdGlvbih7IG5leHQgfSkge1xuICAgIC8vIEV4ZWN1dGUgZWFjaCBjaGlsZCByb3V0ZSB1bnRpbCBvbmUgb2YgdGhlbSByZXR1cm4gdGhlIHJlc3VsdFxuICAgIGNvbnN0IHJvdXRlID0gYXdhaXQgbmV4dCgpO1xuXG4gICAgLy8gUHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBmb3IgdGl0bGUsIGRlc2NyaXB0aW9uIGV0Yy5cbiAgICByb3V0ZS50aXRsZSA9IGAke3JvdXRlLnRpdGxlIHx8ICdVbnRpdGxlZCBQYWdlJ30gLSB3d3cucmVhY3RzdGFydGVya2l0LmNvbWA7XG4gICAgcm91dGUuZGVzY3JpcHRpb24gPSByb3V0ZS5kZXNjcmlwdGlvbiB8fCAnJztcblxuICAgIHJldHVybiByb3V0ZTtcbiAgfSxcbn07XG5cbi8vIFRoZSBlcnJvciBwYWdlIGlzIGF2YWlsYWJsZSBieSBwZXJtYW5lbnQgdXJsIGZvciBkZXZlbG9wbWVudCBtb2RlXG5pZiAoX19ERVZfXykge1xuICByb3V0ZXMuY2hpbGRyZW4udW5zaGlmdCh7XG4gICAgcGF0aDogJy9lcnJvcicsXG4gICAgYWN0aW9uOiByZXF1aXJlKCcuL2Vycm9yJykuZGVmYXVsdCxcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHJvdXRlcztcbiIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCBjb29raWVQYXJzZXIgZnJvbSAnY29va2llLXBhcnNlcic7XG5pbXBvcnQgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcic7XG5pbXBvcnQgbm9kZUZldGNoIGZyb20gJ25vZGUtZmV0Y2gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20vc2VydmVyJztcbmltcG9ydCBQcmV0dHlFcnJvciBmcm9tICdwcmV0dHktZXJyb3InO1xuaW1wb3J0IEFwcCBmcm9tICcuL2NvbXBvbmVudHMvQXBwJztcbmltcG9ydCBIdG1sIGZyb20gJy4vY29tcG9uZW50cy9IdG1sJztcbmltcG9ydCB7IEVycm9yUGFnZVdpdGhvdXRTdHlsZSB9IGZyb20gJy4vcm91dGVzL2Vycm9yL0Vycm9yUGFnZSc7XG5pbXBvcnQgZXJyb3JQYWdlU3R5bGUgZnJvbSAnLi9yb3V0ZXMvZXJyb3IvRXJyb3JQYWdlLmNzcyc7XG5pbXBvcnQgY3JlYXRlRmV0Y2ggZnJvbSAnLi9jcmVhdGVGZXRjaCc7XG5pbXBvcnQgcm91dGVyIGZyb20gJy4vcm91dGVyJztcbi8vIGltcG9ydCBhc3NldHMgZnJvbSAnLi9hc3NldC1tYW5pZmVzdC5qc29uJzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBpbXBvcnQvbm8tdW5yZXNvbHZlZFxuaW1wb3J0IGNodW5rcyBmcm9tICcuL2NodW5rLW1hbmlmZXN0Lmpzb24nOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGltcG9ydC9uby11bnJlc29sdmVkXG5pbXBvcnQgY29uZmlndXJlU3RvcmUgZnJvbSAnLi9zdG9yZS9jb25maWd1cmVTdG9yZSc7XG5pbXBvcnQgeyBzZXRSdW50aW1lVmFyaWFibGUgfSBmcm9tICcuL2FjdGlvbnMvcnVudGltZSc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnJztcblxucHJvY2Vzcy5vbigndW5oYW5kbGVkUmVqZWN0aW9uJywgKHJlYXNvbiwgcCkgPT4ge1xuICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgUmVqZWN0aW9uIGF0OicsIHAsICdyZWFzb246JywgcmVhc29uKTtcbiAgLy8gc2VuZCBlbnRpcmUgYXBwIGRvd24uIFByb2Nlc3MgbWFuYWdlciB3aWxsIHJlc3RhcnQgaXRcbiAgcHJvY2Vzcy5leGl0KDEpO1xufSk7XG5cbi8vXG4vLyBUZWxsIGFueSBDU1MgdG9vbGluZyAoc3VjaCBhcyBNYXRlcmlhbCBVSSkgdG8gdXNlIGFsbCB2ZW5kb3IgcHJlZml4ZXMgaWYgdGhlXG4vLyB1c2VyIGFnZW50IGlzIG5vdCBrbm93bi5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5nbG9iYWwubmF2aWdhdG9yID0gZ2xvYmFsLm5hdmlnYXRvciB8fCB7fTtcbmdsb2JhbC5uYXZpZ2F0b3IudXNlckFnZW50ID0gZ2xvYmFsLm5hdmlnYXRvci51c2VyQWdlbnQgfHwgJ2FsbCc7XG5cbmNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcblxuLy9cbi8vIElmIHlvdSBhcmUgdXNpbmcgcHJveHkgZnJvbSBleHRlcm5hbCBtYWNoaW5lLCB5b3UgY2FuIHNldCBUUlVTVF9QUk9YWSBlbnZcbi8vIERlZmF1bHQgaXMgdG8gdHJ1c3QgcHJveHkgaGVhZGVycyBvbmx5IGZyb20gbG9vcGJhY2sgaW50ZXJmYWNlLlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmFwcC5zZXQoJ3RydXN0IHByb3h5JywgY29uZmlnLnRydXN0UHJveHkpO1xuXG4vL1xuLy8gUmVnaXN0ZXIgTm9kZS5qcyBtaWRkbGV3YXJlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuYXBwLnVzZShleHByZXNzLnN0YXRpYyhwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAncHVibGljJykpKTtcbmFwcC51c2UoY29va2llUGFyc2VyKCkpO1xuYXBwLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSB9KSk7XG5hcHAudXNlKGJvZHlQYXJzZXIuanNvbigpKTtcblxuLy9cbi8vIFJlZ2lzdGVyIHNlcnZlci1zaWRlIHJlbmRlcmluZyBtaWRkbGV3YXJlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuYXBwLmdldCgnKicsIGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGNzcyA9IG5ldyBTZXQoKTtcblxuICAgIC8vIEVuYWJsZXMgY3JpdGljYWwgcGF0aCBDU1MgcmVuZGVyaW5nXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaWFzb2Z0L2lzb21vcnBoaWMtc3R5bGUtbG9hZGVyXG4gICAgY29uc3QgaW5zZXJ0Q3NzID0gKC4uLnN0eWxlcykgPT4ge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVyc2NvcmUtZGFuZ2xlXG4gICAgICBzdHlsZXMuZm9yRWFjaChzdHlsZSA9PiBjc3MuYWRkKHN0eWxlLl9nZXRDc3MoKSkpO1xuICAgIH07XG5cbiAgICAvLyBVbml2ZXJzYWwgSFRUUCBjbGllbnRcbiAgICBjb25zdCBmZXRjaCA9IGNyZWF0ZUZldGNoKG5vZGVGZXRjaCwge1xuICAgICAgYmFzZVVybDogY29uZmlnLmFwaS5zZXJ2ZXJVcmwsXG4gICAgICBjb29raWU6IHJlcS5oZWFkZXJzLmNvb2tpZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGluaXRpYWxTdGF0ZSA9IHtcbiAgICAgIHVzZXI6IHJlcS51c2VyIHx8IG51bGwsXG4gICAgfTtcblxuICAgIGNvbnN0IHN0b3JlID0gY29uZmlndXJlU3RvcmUoaW5pdGlhbFN0YXRlLCB7XG4gICAgICBmZXRjaCxcbiAgICAgIC8vIEkgc2hvdWxkIG5vdCB1c2UgYGhpc3RvcnlgIG9uIHNlcnZlci4uIGJ1dCBob3cgSSBkbyByZWRpcmVjdGlvbj8gZm9sbG93IHVuaXZlcnNhbC1yb3V0ZXJcbiAgICB9KTtcblxuICAgIHN0b3JlLmRpc3BhdGNoKFxuICAgICAgc2V0UnVudGltZVZhcmlhYmxlKHtcbiAgICAgICAgbmFtZTogJ2luaXRpYWxOb3cnLFxuICAgICAgICB2YWx1ZTogRGF0ZS5ub3coKSxcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBHbG9iYWwgKGNvbnRleHQpIHZhcmlhYmxlcyB0aGF0IGNhbiBiZSBlYXNpbHkgYWNjZXNzZWQgZnJvbSBhbnkgUmVhY3QgY29tcG9uZW50XG4gICAgLy8gaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy9jb250ZXh0Lmh0bWxcbiAgICBjb25zdCBjb250ZXh0ID0ge1xuICAgICAgaW5zZXJ0Q3NzLFxuICAgICAgZmV0Y2gsXG4gICAgICAvLyBUaGUgdHdpbnMgYmVsb3cgYXJlIHdpbGQsIGJlIGNhcmVmdWwhXG4gICAgICBwYXRobmFtZTogcmVxLnBhdGgsXG4gICAgICBxdWVyeTogcmVxLnF1ZXJ5LFxuICAgICAgLy8gWW91IGNhbiBhY2Nlc3MgcmVkdXggdGhyb3VnaCByZWFjdC1yZWR1eCBjb25uZWN0XG4gICAgICBzdG9yZSxcbiAgICAgIHN0b3JlU3Vic2NyaXB0aW9uOiBudWxsLFxuICAgIH07XG5cbiAgICBjb25zdCByb3V0ZSA9IGF3YWl0IHJvdXRlci5yZXNvbHZlKGNvbnRleHQpO1xuXG4gICAgaWYgKHJvdXRlLnJlZGlyZWN0KSB7XG4gICAgICByZXMucmVkaXJlY3Qocm91dGUuc3RhdHVzIHx8IDMwMiwgcm91dGUucmVkaXJlY3QpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGEgPSB7IC4uLnJvdXRlIH07XG4gICAgZGF0YS5jaGlsZHJlbiA9IFJlYWN0RE9NLnJlbmRlclRvU3RyaW5nKFxuICAgICAgPEFwcCBjb250ZXh0PXtjb250ZXh0fT57cm91dGUuY29tcG9uZW50fTwvQXBwPixcbiAgICApO1xuICAgIGRhdGEuc3R5bGVzID0gW3sgaWQ6ICdjc3MnLCBjc3NUZXh0OiBbLi4uY3NzXS5qb2luKCcnKSB9XTtcblxuICAgIGNvbnN0IHNjcmlwdHMgPSBuZXcgU2V0KCk7XG4gICAgY29uc3QgYWRkQ2h1bmsgPSBjaHVuayA9PiB7XG4gICAgICBpZiAoY2h1bmtzW2NodW5rXSkge1xuICAgICAgICBjaHVua3NbY2h1bmtdLmZvckVhY2goYXNzZXQgPT4gc2NyaXB0cy5hZGQoYXNzZXQpKTtcbiAgICAgIH0gZWxzZSBpZiAoX19ERVZfXykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENodW5rIHdpdGggbmFtZSAnJHtjaHVua30nIGNhbm5vdCBiZSBmb3VuZGApO1xuICAgICAgfVxuICAgIH07XG4gICAgYWRkQ2h1bmsoJ2NsaWVudCcpO1xuICAgIGlmIChyb3V0ZS5jaHVuaykgYWRkQ2h1bmsocm91dGUuY2h1bmspO1xuICAgIGlmIChyb3V0ZS5jaHVua3MpIHJvdXRlLmNodW5rcy5mb3JFYWNoKGFkZENodW5rKTtcblxuICAgIGRhdGEuc2NyaXB0cyA9IEFycmF5LmZyb20oc2NyaXB0cyk7XG4gICAgZGF0YS5hcHAgPSB7XG4gICAgICBhcGlVcmw6IGNvbmZpZy5hcGkuY2xpZW50VXJsLFxuICAgICAgc3RhdGU6IGNvbnRleHQuc3RvcmUuZ2V0U3RhdGUoKSxcbiAgICB9O1xuXG4gICAgY29uc3QgaHRtbCA9IFJlYWN0RE9NLnJlbmRlclRvU3RhdGljTWFya3VwKDxIdG1sIHsuLi5kYXRhfSAvPik7XG4gICAgcmVzLnN0YXR1cyhyb3V0ZS5zdGF0dXMgfHwgMjAwKTtcbiAgICByZXMuc2VuZChgPCFkb2N0eXBlIGh0bWw+JHtodG1sfWApO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBuZXh0KGVycik7XG4gIH1cbn0pO1xuXG4vL1xuLy8gRXJyb3IgaGFuZGxpbmdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBwZSA9IG5ldyBQcmV0dHlFcnJvcigpO1xucGUuc2tpcE5vZGVGaWxlcygpO1xucGUuc2tpcFBhY2thZ2UoJ2V4cHJlc3MnKTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG5hcHAudXNlKChlcnIsIHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gIGNvbnNvbGUuZXJyb3IocGUucmVuZGVyKGVycikpO1xuICBjb25zdCBodG1sID0gUmVhY3RET00ucmVuZGVyVG9TdGF0aWNNYXJrdXAoXG4gICAgPEh0bWxcbiAgICAgIHRpdGxlPVwiSW50ZXJuYWwgU2VydmVyIEVycm9yXCJcbiAgICAgIGRlc2NyaXB0aW9uPXtlcnIubWVzc2FnZX1cbiAgICAgIHN0eWxlcz17W3sgaWQ6ICdjc3MnLCBjc3NUZXh0OiBlcnJvclBhZ2VTdHlsZS5fZ2V0Q3NzKCkgfV19IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZXJzY29yZS1kYW5nbGVcbiAgICA+XG4gICAgICB7UmVhY3RET00ucmVuZGVyVG9TdHJpbmcoPEVycm9yUGFnZVdpdGhvdXRTdHlsZSBlcnJvcj17ZXJyfSAvPil9XG4gICAgPC9IdG1sPixcbiAgKTtcbiAgcmVzLnN0YXR1cyhlcnIuc3RhdHVzIHx8IDUwMCk7XG4gIHJlcy5zZW5kKGA8IWRvY3R5cGUgaHRtbD4ke2h0bWx9YCk7XG59KTtcblxuLy9cbi8vIExhdW5jaCB0aGUgc2VydmVyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuaWYgKCFtb2R1bGUuaG90KSB7XG4gIGFwcC5saXN0ZW4oY29uZmlnLnBvcnQsICgpID0+IHtcbiAgICBjb25zb2xlLmluZm8oYFRoZSBzZXJ2ZXIgaXMgcnVubmluZyBhdCBodHRwOi8vbG9jYWxob3N0OiR7Y29uZmlnLnBvcnR9L2ApO1xuICB9KTtcbn1cblxuLy9cbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5pZiAobW9kdWxlLmhvdCkge1xuICBhcHAuaG90ID0gbW9kdWxlLmhvdDtcbiAgbW9kdWxlLmhvdC5hY2NlcHQoJy4vcm91dGVyJyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFwcDtcbiIsImltcG9ydCB7IGNyZWF0ZVN0b3JlLCBhcHBseU1pZGRsZXdhcmUgfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgdGh1bmsgZnJvbSAncmVkdXgtdGh1bmsnO1xuaW1wb3J0IHsgY29tcG9zZVdpdGhEZXZUb29scyB9IGZyb20gJ3JlZHV4LWRldnRvb2xzLWV4dGVuc2lvbi9kZXZlbG9wbWVudE9ubHknO1xuaW1wb3J0IHsgbmFtZSwgdmVyc2lvbiB9IGZyb20gJy4uLy4uL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgcm9vdFJlZHVjZXIgZnJvbSAnLi4vcmVkdWNlcnMnO1xuaW1wb3J0IGNyZWF0ZUhlbHBlcnMgZnJvbSAnLi9jcmVhdGVIZWxwZXJzJztcbmltcG9ydCBjcmVhdGVMb2dnZXIgZnJvbSAnLi9sb2dnZXInO1xuaW1wb3J0IGNyZWF0ZU1pZGRsZXdhcmUgZnJvbSAnLi9taWRkbGV3YXJlL2NsaWVudE1pZGRsZXdhcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb25maWd1cmVTdG9yZShpbml0aWFsU3RhdGUsIGhlbHBlcnNDb25maWcpIHtcbiAgY29uc3QgaGVscGVycyA9IGNyZWF0ZUhlbHBlcnMoaGVscGVyc0NvbmZpZyk7XG4gIGNvbnN0IG1pZGRsZXdhcmUgPSBbXG4gICAgdGh1bmsud2l0aEV4dHJhQXJndW1lbnQoaGVscGVycyksXG4gICAgY3JlYXRlTWlkZGxld2FyZShoZWxwZXJzLmZldGNoKSxcbiAgXTtcblxuICBsZXQgZW5oYW5jZXI7XG5cbiAgaWYgKF9fREVWX18pIHtcbiAgICBtaWRkbGV3YXJlLnB1c2goY3JlYXRlTG9nZ2VyKCkpO1xuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3phbG1veGlzdXMvcmVkdXgtZGV2dG9vbHMtZXh0ZW5zaW9uIzE0LXVzaW5nLWluLXByb2R1Y3Rpb25cbiAgICBjb25zdCBjb21wb3NlRW5oYW5jZXJzID0gY29tcG9zZVdpdGhEZXZUb29scyh7XG4gICAgICAvLyBPcHRpb25zOiBodHRwczovL2dpdGh1Yi5jb20vemFsbW94aXN1cy9yZWR1eC1kZXZ0b29scy1leHRlbnNpb24vYmxvYi9tYXN0ZXIvZG9jcy9BUEkvQXJndW1lbnRzLm1kI29wdGlvbnNcbiAgICAgIG5hbWU6IGAke25hbWV9QCR7dmVyc2lvbn1gLFxuICAgIH0pO1xuXG4gICAgLy8gaHR0cHM6Ly9yZWR1eC5qcy5vcmcvZG9jcy9hcGkvYXBwbHlNaWRkbGV3YXJlLmh0bWxcbiAgICBlbmhhbmNlciA9IGNvbXBvc2VFbmhhbmNlcnMoYXBwbHlNaWRkbGV3YXJlKC4uLm1pZGRsZXdhcmUpKTtcbiAgfSBlbHNlIHtcbiAgICBlbmhhbmNlciA9IGFwcGx5TWlkZGxld2FyZSguLi5taWRkbGV3YXJlKTtcbiAgfVxuXG4gIC8vIGh0dHBzOi8vcmVkdXguanMub3JnL2RvY3MvYXBpL2NyZWF0ZVN0b3JlLmh0bWxcbiAgY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShyb290UmVkdWNlciwgaW5pdGlhbFN0YXRlLCBlbmhhbmNlcik7XG5cbiAgLy8gSG90IHJlbG9hZCByZWR1Y2VycyAocmVxdWlyZXMgV2VicGFjayBvciBCcm93c2VyaWZ5IEhNUiB0byBiZSBlbmFibGVkKVxuICBpZiAoX19ERVZfXyAmJiBtb2R1bGUuaG90KSB7XG4gICAgbW9kdWxlLmhvdC5hY2NlcHQoJy4uL3JlZHVjZXJzJywgKCkgPT5cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBnbG9iYWwtcmVxdWlyZVxuICAgICAgc3RvcmUucmVwbGFjZVJlZHVjZXIocmVxdWlyZSgnLi4vcmVkdWNlcnMnKS5kZWZhdWx0KSxcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIHN0b3JlO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlSGVscGVycyh7IGZldGNoLCBoaXN0b3J5IH0pIHtcbiAgcmV0dXJuIHtcbiAgICBoaXN0b3J5LFxuICAgIGZldGNoLFxuICB9O1xufVxuIiwiaW1wb3J0IHsgaW5zcGVjdCB9IGZyb20gJ3V0aWwnO1xuXG5mdW5jdGlvbiBpbnNwZWN0T2JqZWN0KG9iamVjdCkge1xuICByZXR1cm4gaW5zcGVjdChvYmplY3QsIHtcbiAgICBjb2xvcnM6IHRydWUsXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzaW5nbGVMaW5lKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL1xccysvZywgJyAnKTtcbn1cblxuY29uc3QgYWN0aW9uRm9ybWF0dGVycyA9IHtcbiAgLy8gVGhpcyBpcyB1c2VkIGF0IGZlYXR1cmUvYXBvbGxvIGJyYW5jaCwgYnV0IGl0IGNhbiBoZWxwIHlvdSB3aGVuIGltcGxlbWVudGluZyBBcG9sbG9cbiAgQVBPTExPX1FVRVJZX0lOSVQ6IGEgPT5cbiAgICBgcXVlcnlJZDoke2EucXVlcnlJZH0gdmFyaWFibGVzOiR7aW5zcGVjdE9iamVjdChcbiAgICAgIGEudmFyaWFibGVzLFxuICAgICl9XFxuICAgJHtzaW5nbGVMaW5lKGEucXVlcnlTdHJpbmcpfWAsXG5cbiAgQVBPTExPX1FVRVJZX1JFU1VMVDogYSA9PlxuICAgIGBxdWVyeUlkOiR7YS5xdWVyeUlkfVxcbiAgICR7c2luZ2xlTGluZShpbnNwZWN0T2JqZWN0KGEucmVzdWx0KSl9YCxcblxuICBBUE9MTE9fUVVFUllfU1RPUDogYSA9PiBgcXVlcnlJZDoke2EucXVlcnlJZH1gLFxufTtcblxuLy8gU2VydmVyIHNpZGUgcmVkdXggYWN0aW9uIGxvZ2dlclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlTG9nZ2VyKCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgcmV0dXJuIHN0b3JlID0+IG5leHQgPT4gYWN0aW9uID0+IHtcbiAgICBsZXQgZm9ybWF0dGVkUGF5bG9hZCA9ICcnO1xuICAgIGNvbnN0IGFjdGlvbkZvcm1hdHRlciA9IGFjdGlvbkZvcm1hdHRlcnNbYWN0aW9uLnR5cGVdO1xuICAgIGlmICh0eXBlb2YgYWN0aW9uRm9ybWF0dGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBmb3JtYXR0ZWRQYXlsb2FkID0gYWN0aW9uRm9ybWF0dGVyKGFjdGlvbik7XG4gICAgfSBlbHNlIGlmIChhY3Rpb24udG9TdHJpbmcgIT09IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcpIHtcbiAgICAgIGZvcm1hdHRlZFBheWxvYWQgPSBhY3Rpb24udG9TdHJpbmcoKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBhY3Rpb24ucGF5bG9hZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGZvcm1hdHRlZFBheWxvYWQgPSBpbnNwZWN0T2JqZWN0KGFjdGlvbi5wYXlsb2FkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9ybWF0dGVkUGF5bG9hZCA9IGluc3BlY3RPYmplY3QoYWN0aW9uKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhgICogJHthY3Rpb24udHlwZX06ICR7Zm9ybWF0dGVkUGF5bG9hZH1gKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgcmV0dXJuIG5leHQoYWN0aW9uKTtcbiAgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNsaWVudE1pZGRsZXdhcmUoY2xpZW50KSB7XG4gIHJldHVybiAoeyBkaXNwYXRjaCwgZ2V0U3RhdGUgfSkgPT4gbmV4dCA9PiBhY3Rpb24gPT4ge1xuICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gYWN0aW9uKGRpc3BhdGNoLCBnZXRTdGF0ZSk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBwcm9taXNlLCB0eXBlcywgLi4ucmVzdCB9ID0gYWN0aW9uOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXJlZGVjbGFyZVxuICAgIGlmICghcHJvbWlzZSkge1xuICAgICAgcmV0dXJuIG5leHQoYWN0aW9uKTtcbiAgICB9XG5cbiAgICBjb25zdCBbUkVRVUVTVCwgU1VDQ0VTUywgRkFJTFVSRV0gPSB0eXBlcztcbiAgICBuZXh0KHsgLi4ucmVzdCwgdHlwZTogUkVRVUVTVCB9KTtcblxuICAgIGNvbnN0IGFjdGlvblByb21pc2UgPSBwcm9taXNlKGNsaWVudCk7XG4gICAgYWN0aW9uUHJvbWlzZVxuICAgICAgLnRoZW4oXG4gICAgICAgIGFzeW5jIHJlcyA9PiB7XG4gICAgICAgICAgY29uc3QgcmVzVGV4dCA9IGF3YWl0IHJlcy50ZXh0KCk7XG4gICAgICAgICAgY29uc3QganNvbiA9IHJlc1RleHQgPyBKU09OLnBhcnNlKHJlc1RleHQpIDoge307XG4gICAgICAgICAgaWYgKHJlcy5zdGF0dXMgPj0gNDAwKSB7XG4gICAgICAgICAgICBuZXh0KHsgLi4ucmVzdCwgZXJyb3I6IGpzb24sIHR5cGU6IEZBSUxVUkUgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgc3RhdHVzOiByZXMuc3RhdHVzLFxuICAgICAgICAgICAgICB0b3RhbDogTnVtYmVyLnBhcnNlSW50KHJlcy5oZWFkZXJzLmdldCgneC10b3RhbC1jb3VudCcpLCAxMCkgfHwgMCxcbiAgICAgICAgICAgICAganNvbixcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIG5leHQoeyAuLi5yZXN0LCByZXN1bHQsIHR5cGU6IFNVQ0NFU1MgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvciA9PiBuZXh0KHsgLi4ucmVzdCwgZXJyb3IsIHR5cGU6IEZBSUxVUkUgfSksXG4gICAgICApXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdNSURETEVXQVJFIEVSUk9SOicsIGVycm9yKTtcbiAgICAgICAgbmV4dCh7IC4uLnJlc3QsIGVycm9yLCB0eXBlOiBGQUlMVVJFIH0pO1xuICAgICAgfSk7XG5cbiAgICByZXR1cm4gYWN0aW9uUHJvbWlzZTtcbiAgfTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBiYWJlbC9wb2x5ZmlsbFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvanNvbi9zdHJpbmdpZnlcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL3NsaWNlZFRvQXJyYXlcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYm9keS1wYXJzZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29va2llLXBhcnNlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhpc3RvcnkvY3JlYXRlQnJvd3Nlckhpc3RvcnlcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaXNvbW9ycGhpYy1zdHlsZS1sb2FkZXIvbGliL3dpdGhTdHlsZXNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9kYXNoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5vZGUtZmV0Y2hcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwcmV0dHktZXJyb3JcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicHJvcC10eXBlc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdC1kb20vc2VydmVyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0LXJlZHV4XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlZHV4XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlZHV4LWRldnRvb2xzLWV4dGVuc2lvbi9kZXZlbG9wbWVudE9ubHlcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVkdXgtdGh1bmtcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic2VyaWFsaXplLWphdmFzY3JpcHRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidW5pdmVyc2FsLXJvdXRlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1dGlsXCIpOyJdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ3R2QkE7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQzNIQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBRkE7QUFPQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDWkE7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFhQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBOzs7Ozs7Ozs7Ozs7O0FBUUE7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBaEJBO0FBQ0E7QUFEQTs7OztBQUNBO0FBQ0E7QUFDQTtBQUZBOztBQURBOzs7O0FBTUE7O0FBYUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25FQTs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQW9CQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREE7QUFHQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUhBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURBO0FBUUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUFBO0FBQUE7QUFEQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBO0FBQ0E7QUFEQTtBQURBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVlBO0FBQ0E7QUFDQTtBQUhBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVNBOzs7O0FBdEVBO0FBQ0E7QUFEQTs7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUFBO0FBQ0E7QUFYQTs7QUFEQTs7OztBQWVBO0FBQ0E7QUFDQTtBQUZBOztBQTBEQTs7Ozs7OztBQ3pGQTs7Ozs7Ozs7O0FBU0E7QUFFQSxhQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFTQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFNQTtBQUNBO0FBQ0E7QUFHQTtBQUpBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQW5CQTtBQTNCQTs7Ozs7Ozs7QUNqQkE7QUFBQTtBQUFBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQVFBOzs7Ozs7QUFNQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFHQTtBQUFBO0FBUEE7QUFXQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS0E7QUFIQTtBQUNBO0FBSEE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFjQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDOUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFGQTs7Ozs7Ozs7Ozs7Ozs7O0FDSkE7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQVBBO0FBU0E7Ozs7Ozs7O0FDWkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBRkE7QUFJQTs7Ozs7Ozs7QUNMQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7OztBQVNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBWEE7Ozs7Ozs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3QkE7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FBYUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0E7Ozs7QUE3QkE7QUFDQTtBQURBOzs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBREE7O0FBREE7Ozs7QUFTQTtBQUNBO0FBREE7O0FBdUJBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDL0NBOzs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDbkJBOzs7Ozs7Ozs7QUFTQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUZBO0FBTUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUZBO0FBTUE7QUFqQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWlCQTtBQWpCQTtBQUFBO0FBQ0E7QUFEQTtBQW1CQTtBQUVBO0FBQ0E7QUFDQTtBQXZCQTtBQUNBO0FBREE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQTZCQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pEQTs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBR0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQURBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFLQTtBQUVBO0FBQ0E7QUFGQTtBQU9BO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSQTtBQW5DQTtBQUFBO0FBQ0E7QUFEQTtBQThDQTtBQUNBO0FBL0NBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFnREE7QUFqREE7QUFDQTtBQURBO0FBcURBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUtBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQS9FQTtBQUFBO0FBQ0E7QUFEQTtBQUFBO0FBQUE7QUFpRkE7QUFDQTtBQWxGQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFBQTtBQUFBO0FBQUE7QUFzRkE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFIQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQUEsYUFJQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDMUxBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFLQTtBQUNBLFdBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBRUE7QUFGQTtBQUFBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDN0NBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBOzs7Ozs7OztBQ0xBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUtBO0FBQUE7QUFBQTtBQUdBO0FBQUE7QUFBQTtBQVZBO0FBQ0E7QUFhQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQWZBO0FBQUE7QUFnQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBVEE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQVVBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQU1BO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQWRBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFIQTtBQUFBO0FBQUE7QUFBQTtBQWlCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQXZDQTtBQUFBO0FBd0NBOzs7Ozs7Ozs7Ozs7Ozs7O0FDekNBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7O0EiLCJzb3VyY2VSb290IjoiIn0=
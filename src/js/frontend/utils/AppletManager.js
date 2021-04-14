import { brainsatplay } from "../../brainsatplay";
import { DOMFragment } from "./DOMFragment";


export class AppletManager {
    /**
     * @constructor
     * @alias AppletManager
     * @description Main container for WebBCI applets.
     */
    constructor(initUI = () => {}, deinitUI = () => {}, appletClasses=[], appletConfigs=[], appletSelectIds=["applet1","applet2","applet3","applet4"], bcisession=new brainsatplay()) {
        this.initUI = initUI;
        this.deinitUI = deinitUI;
        this.initUI();

        
        this.appletClasses = appletClasses;
        this.appletsSpawned = 0;

        // Layout Constraints
        if (!window.isMobile){
            this.maxApplets = 4;
        } else {
            this.maxApplets = 1;
        }

        this.layoutTemplates = {
            'Focus': {generate: (labels) => {
                    let rows = 3
                    let bottomCols = labels.active.length - 1
                    return Array.from({length: rows},e=>[]).map((a,i) => {
                        if (bottomCols > 0){
                            if (i < rows-1){
                                for (let j = 0; j < bottomCols; j++) a.push(labels.active[0])
                            } else {
                                for (let j = 0; j < bottomCols; j++) a.push(labels.active[j+1])
                            }
                        } else {
                            a.push(labels.active[0])
                        }
                        return a
                    })
                }},
            'Grid': {generate: (labels) => {
                    let rows = Math.ceil(Math.sqrt(labels.active.length))
                    let layout = Array.from({length: rows},e=>[]).map((a,i) => {
                        for (let j = 0; j < rows; j++) {
                            a.push(labels.all[rows*(i)+j])
                        }
                        return a
                    })

                    let getReplacementLabel = ({active, inactive, all},baseLayout,i,j) => {
                        if (active.includes(baseLayout[i][j-1])) return baseLayout[i][j-1]
                        if (active.includes(baseLayout[i][j+1])) return baseLayout[i][j+1]
                        if (baseLayout[i-1] != null && active.includes(baseLayout[i-1][j])) return baseLayout[i-1][j]
                        if (baseLayout[i+1] != null &&  active.includes(baseLayout[i+1][j])) return baseLayout[i+1][j]
                    }
                    
                        layout = layout.map((row,i) => {
                            return row.map((val,j) => {
                                if (labels.inactive.includes(val)) { // Replace inactive applets
                                    return getReplacementLabel(labels,layout,i,j) ?? val
                                }
                                else return val
                            })
                        })
                    return layout
            }}
        }

        this.appletPresets = [
            {
                value: 'eeg_nf',
                name: "EEG Neurofeedback",
                applets: [
                    "Blob",
                    "uPlot",
                    "Spectrogram",
                    "Brain Map"
                ]
            },
            {
                value: 'heg_nf',
                name: "HEG Neurofeedback",
                applets: [
                    "Sunrise",
                    "HEGBoids",
                    "HEGCircle",
                    "HEGAudio"
                ]
            }
        ]

        this.appletPresets.forEach((obj,i) => {
            document.getElementById("config-selector").innerHTML += `
            <option value=${obj.value}>${obj.name}</option>
            `
        })

        // Other
        this.applets = Array.from({length: this.maxApplets}, (e,i) => { return {appletIdx: i+1,name:null,classinstance: null}});

        this.bcisession=bcisession;
    
        this.appletSelectIds = appletSelectIds;

        this.initAddApplets(appletConfigs);

        window.addEventListener('resize', ()=>{
            this.responsive();
        })

        //this.responsive(); 
    
        // Set Styling Properly
        let applets = document.getElementById('applets');
        applets.style.display = 'grid'
        applets.style.height = 'calc(100vh)' // Must subtract any top navigation bar
        applets.style.width = 'calc(100vw - 75px)'
        
    }

    initUI = () => {}

    deinitUI = () => {}

    // Check class compatibility with current devices
    checkCompatibility = (classObj, devices=this.bcisession.devices) => {
        let compatible = false
        if (this.bcisession.devices.length === 0) compatible = true
        else {
            this.bcisession.devices.forEach((device) => {
                if(Array.isArray(classObj.devices)) { // Check devices only
                    if (classObj.devices.includes(device.info.deviceType) || classObj.devices.includes(device.info.deviceName)) compatible = true
                } 
                else if (typeof classObj.devices === 'object'){ // Check devices AND specific channel tags
                    if (classObj.devices.includes(device.info.devices.deviceType) || classObj.devices.devices.includes(device.info.deviceName)){
                        if(classObj.devices.eegChannelTags) {
                            classObj.devices.eegChannelTags.forEach((tag,k) => {
                                let found = o.atlas.eegshared.eegChannelTags.find((t) => {
                                    if(t.tag === tag) {
                                        return true;
                                    }
                                }); 
                                if(found) compatible = true;
                            });
                        }
                    }
                }
            })
        }

        return compatible
    }

    //add the initial list of applets
    initAddApplets = (appletConfigs=[]) => {

        // Load Config
        let config = undefined;
        if(appletConfigs.length !== 0) {
            appletConfigs.forEach((cfg,i)=> {
                this.appletClasses.find((o,j) => {
                    if(cfg.name === o.name) {
                        config = cfg.settings;
                    }
                });
            });
        }

        let appletNames = this.appletPresets.find(preset => preset.value === document.getElementById("config-selector").value).applets
        let configApplets = []

        // Collect a list of unused applets
        let currentApplets = this.applets.map(applet => applet.name)
        let unusedAppletClasses = this.appletClasses.filter(applet => {
            let usable = false;
            if (appletNames.includes(applet.name)){ // Filter applets based on preset selector
                if (!currentApplets.includes(applet.name)){ // Filter currently used applets (no duplicates)
                    usable = this.checkCompatibility(applet.cls) // Check if applet is compatible with current device(s)
                    if (usable || this.bcisession.devices.length === 0) return applet // Return if your device is compatible OR no device is connected
                }
            }
        })

        appletNames.forEach(name => {
            configApplets.push(this.appletClasses.find(applet =>applet.name === name))
        })

        // Check the compatibility of current applets with connected devices
        this.appletsSpawned = 0;
        currentApplets.forEach((className,i) => {
            let applet = this.appletClasses.filter(applet => applet.name == className)[0]
            let compatible = false;
            if (applet != null) compatible = this.checkCompatibility(applet.cls) // Check if applet is compatible with current device(s)
            // else if (currentApplets.reduce((tot,cur) => tot + (cur == undefined)) != currentApplets.length-1) compatible = true // If all applets are not undefined, keep same layout
            
            // Replace incompatible applets
            if (!compatible){
                // Deinit old applet
                if (this.applets[i].classinstance != null){
                    this.deinitApplet(this.applets[i].appletIdx);
                }

                // Add new applet
                let classObj = configApplets[0] //unusedAppletClasses[0]
                this.applets[i] = {
                    appletIdx: i+1,
                    name:classObj.name,
                    classinstance: new classObj.cls("applets",this.bcisession,config)
                }

                console.log(configApplets)
                configApplets.splice(0,1) // unusedAppletClasses.splice(0,1)
            }
            this.appletsSpawned++;
        })

        this.initApplets();

        // Generate applet selectors
        this.appletSelectIds.forEach((id,i) => {
            if (i < this.maxApplets){
                this.addAppletOptions(id,i);
            }
        }) 
    }

    appletDivSettings = (appletDiv, appletIdx) => {
        appletDiv.style.gridArea = String.fromCharCode(97 + appletIdx);
        appletDiv.style.overflow = 'hidden'
        // appletDiv.draggable = true
        // appletDiv.style.cursor = 'move'
        // Fullscreen Functionality
        appletDiv.addEventListener('dblclick', () => {
            const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
            if (!fullscreenElement){
                if (appletDiv.requestFullscreen){
                    appletDiv.requestFullscreen()
                } else if (appletDiv.webkitRequestFullscreen){
                    appletDiv.webkitRequestFullscreen()
                }
            } else {
                if (document.exitFullscreen){
                    document.exitFullscreen()
                } else if (document.webkitExitFullscreen){
                    document.webkitExitFullscreen()
                }
            }
        });
    }

    //initialize applets added to the list into each container by index
    initApplets = () => {

        // Assign applets to proper areas
        this.applets.forEach((applet,i) => {
            if (applet.classinstance != null){
            if(applet.classinstance.AppletHTML === null) { applet.classinstance.init(); }
            let appletDiv =  applet.classinstance.AppletHTML.node;
            appletDiv.style.gridArea = String.fromCharCode(97 + i);
            appletDiv.style.overflow = 'hidden'
            appletDiv.name = applet.name

            // Drag functionality
            // appletDiv.draggable = true
            // appletDiv.classList.add("draggable")
            appletDiv.addEventListener('dragstart', () => {
                appletDiv.classList.add("dragging")
            })
            appletDiv.addEventListener('dragend', () => {
                appletDiv.classList.remove("dragging")
            })

            appletDiv.addEventListener('dragover', (e) => {
                e.preventDefault()
                // let dragging = document.querySelector('.dragging')
                // let draggingApplet = this.applets.find(applet => applet.name == dragging.name) 
                // let hoveredApplet = this.applets.find(applet => applet.name == appletDiv.name)
                // this.applets[draggingApplet.appletIdx - 1].appletIdx = hoveredApplet.appletIdx;
                // this.applets[hoveredApplet.appletIdx - 1].appletIdx = draggingApplet.appletIdx;
                // let htmlString = '<h1>Replaced!</h1>'
                // appletDiv.innerHTML = htmlString.trim();
                // appletDiv.parentNode.replaceChild(appletDiv,appletDiv)
                appletDiv.classList.add('hovered')
            })

            appletDiv.addEventListener('dragleave', (e) => {
                e.preventDefault()
                // let dragging = document.querySelector('.dragging')
                // let draggingApplet = this.applets.find(applet => applet.name == dragging.name) 
                // let hoveredApplet = this.applets.find(applet => applet.name == appletDiv.name)
                // this.applets[draggingApplet.appletIdx - 1].appletIdx = hoveredApplet.appletIdx;
                // this.applets[hoveredApplet.appletIdx - 1].appletIdx = draggingApplet.appletIdx;
                // let htmlString = '<h1>Replaced!</h1>'
                // appletDiv.innerHTML = htmlString.trim();
                // appletDiv.parentNode.replaceChild(appletDiv,appletDiv)
                appletDiv.classList.remove('hovered')
            })

            appletDiv.addEventListener("drop", function(event) {
                event.preventDefault();
                let dragging = document.querySelector('.dragging')
                appletDiv.classList.remove('hovered')
              }, false);

            // Fullscreen Functionality
            appletDiv.addEventListener('dblclick', () => {
                const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
                if (!fullscreenElement){
                    if (appletDiv.requestFullscreen){
                        appletDiv.requestFullscreen()
                    } else if (appletDiv.webkitRequestFullscreen){
                        appletDiv.webkitRequestFullscreen()
                    }
                } else {
                    if (document.exitFullscreen){
                        document.exitFullscreen()
                    } else if (document.webkitExitFullscreen){
                        document.webkitExitFullscreen()
                    }
                }
            });
        }
        });
        this.enforceLayout();
        this.responsive();
    }

    addApplet = (appletClassIdx, appletIdx, settings=undefined) => {
        if(this.appletsSpawned < this.maxApplets) {
            var classObj = this.appletClasses[appletClassIdx];
            var found = this.applets.find((o,i) => {
                if(o.appletIdx === appletIdx) {
                    this.deinitApplet(appletIdx);
                    return true;
                }
            });
            //let containerId = Math.floor(Math.random()*100000)+"applet";
            //let container = new DOMFragment(`<div id=${containerId}></div>`,"applets"); //make container, then delete when deiniting (this.applets[i].container.deleteFragment());
                   
            //var pos = appletIdx-1; if(pos > this.applets.length) {pos = this.applets.length; this.applets.push({appletIdx: appletIdx, name: classObj.name, classinstance: new classObj.cls("applets",this.bcisession), container: container});}
            //else { this.applets.splice(pos,0,{appletIdx: appletIdx, name: classObj.name, classinstance: new classObj.cls("applets",this.bcisession), container: container});}
            var pos = appletIdx-1; if(pos > this.applets.length) {pos = this.applets.length; this.applets[pos] = {appletIdx: pos+1,name: classObj.name, classinstance: new classObj.cls("applets",this.bcisession,settings)};}
            else { this.applets[pos] = {appletIdx: pos+1, name: classObj.name, classinstance: new classObj.cls("applets",this.bcisession,settings)};}
            
            this.applets[pos].classinstance.init();

            let appletDiv =  this.applets[pos].classinstance.AppletHTML.node;
            this.appletDivSettings(appletDiv, pos);
            // this.applets[pos].classinstance.AppletHTML.node.style.gridArea = String.fromCharCode(97 + pos)
            // console.log(this.applets[pos].classinstance.AppletHTML.node.style.gridArea)
            this.appletsSpawned++;
            this.enforceLayout();
            console.log('add applet')
            this.responsive();
        }
    }

    deinitApplet = (appletIdx) => {
        var stateIdx = null;
        var found = this.applets.find((o,i) => {
            if(o.appletIdx === appletIdx && o.classinstance != null) {
                stateIdx = i;  
                if (this.applets[stateIdx].classinstance != null){
                    console.log('deiniting applet' + this.applets[stateIdx].name)
                    this.applets[stateIdx].classinstance.deinit();
                }
                this.applets[stateIdx] = {appletIdx: stateIdx+1,name:null,classinstance: null};
                this.appletsSpawned--;
                this.enforceLayout();
                console.log('remove applet')
                this.responsive();
                return true;
            }
        });
        
    }

    deinitApplets() {
        this.applets.forEach((applet,i) => {
            this.deinitApplet(i+1);
        })
    }

    reinitApplets = () => {
        this.applets.forEach((applet,i) => {
            applet.classinstance.deinit();
            applet.classinstance.init();
        });
        this.responsive();
    }

    addAppletOptions = (selectId,appletIdx) => {
        var select = document.getElementById(selectId);
        select.innerHTML = "";
        var newhtml = `<option value='None' selected="selected">None</option>`;
        this.appletClasses.forEach((classObj,i) => {
            if (this.checkCompatibility(classObj.cls)){
                if(this.applets[appletIdx] && this.applets[appletIdx].name===classObj.name) {
                    newhtml += `<option value='`+classObj.name+`' selected="selected">`+this.appletClasses[i].name+`</option>`;
                }
                else{
                    newhtml += `<option value='`+classObj.name+`'>`+this.appletClasses[i].name+`</option>`;
                }
            }
        });
        select.innerHTML = newhtml;

        select.onchange = (e) => {
            this.deinitApplet(appletIdx+1);
            if(select.value !== 'None'){
                let found = this.appletClasses.find((o,i)=>{
                    if(o.name===select.value){
                        this.addApplet(i,appletIdx+1);
                        return true;
                    }
                });
            }
        }
    }

    enforceLayout(nodes=this.applets) {

        let layoutSelector = document.getElementById('layout-selector')
        let nodeLabels = {
            active: [],
            inactive: [],
            all: []
        }

        this.applets.forEach((app,i) => {
            if (app.classinstance != null){
                nodeLabels.active.push(String.fromCharCode(97 + i))
            } else {
                nodeLabels.inactive.push(String.fromCharCode(97 + i))
            }
            nodeLabels.all.push(String.fromCharCode(97 + i))
        })
        let responsiveLayout = this.layoutTemplates[layoutSelector.value].generate(nodeLabels)
        let layoutRows = responsiveLayout.length
        let layoutColumns = responsiveLayout[0].length
        let activeNodes = nodes.filter(n => n.classinstance != null)

        // Get Row Assignments
        let rowAssignmentArray = Array.from({length: nodes.length}, e => new Set())
        responsiveLayout.forEach((row,j) => {
            row.forEach((col,k) => {
                if (col != null) rowAssignmentArray[col.charCodeAt(0) - 97].add(j)
            })
        })

        let innerStrings = responsiveLayout.map((stringArray) => {
            return '"' + stringArray.join(' ') + '"'
        }).join(' ')

        let applets = document.getElementById('applets');
        applets.style.gridTemplateAreas = innerStrings
        applets.style.gridTemplateColumns = `repeat(${layoutColumns},1fr)`
        applets.style.gridTemplateRows =  `repeat(${layoutRows},1fr)`

        activeNodes.forEach((appnode,i) => {
            let appletDiv =  appnode.classinstance.AppletHTML.node;
            let gridPercent = 100 * rowAssignmentArray[appnode.appletIdx-1].size/layoutRows;
            
            // Set Applet Heights
            appletDiv.style.maxHeight = `calc(${gridPercent}vh)`;

            // Set Applet Overflow
            appletDiv.style.overflow = `hidden`;
        });  
    }

    responsive(nodes=this.applets) {      

        console.log('responsive')
        let activeNodes = nodes.filter(n => n.classinstance != null)
        activeNodes.forEach((applet,i) => {
            applet.classinstance.responsive();
        });
    }
}
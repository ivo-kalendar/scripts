const fs = require("fs")
const path = require("path")

/**
 * this script is used for copying all the files from one destionation to another 
 * with new names generated based on the provided info.
 * 
 * You need to place the script and the folder 
 * that you want to copy in the same directory.
 * 
 * You need to change the name of the folder
 * that you want to copy as the variable: "folder_name", or
 * change the variable: "folder_name" as the folder's name.
 * 
 * The folder that you want to copy need's to have some files.
 * 
 * Optionally: You can change the Copy folder's name
 * Optionally: You can change the Copy filse's name
 * 
 * start the script: node app
 */

// variables
const new_dir_name = "new_copy_folder" // ova treba da go imenuvas od tuka
const base_file_name = "new_copy_file" // ova isto treba od tuka

const folder_name = 'test_folder' // ova treba od tuka za od koj folder da zeme fajlovi





const folder_path = path.join(__dirname, folder_name)
const new_dir_destination_path = path.join(__dirname, new_dir_name)
let files

const start = () => checkPathFolder()

const checkPathFolder = () => {
    if (fs.existsSync(folder_path)) {
        fs.readdir(folder_path, checkPathFiles) 
    } else {
        console.error(
        `
        ...
        ...
        Please provide directory with the name: ${folder_name}, 
        or change the variable: "folder_name" based on the provided folder's name.
        ...
        ...
        `)
    }
}

const checkPathFiles = (err, data) => {
    if (err) {
        console.error('Check path Error', err)
    } else if (!!data && !!data.length) {
        files = data
        checkDestinationFolder()
    } else {
        console.log('No err and no data: ', err, data)
    }
}

const checkDestinationFolder = () => fs.existsSync(new_dir_destination_path) ? checkDestinationFiles() : createNewFolder()

const checkDestinationFiles = () => {
    fs.readdir(new_dir_destination_path, (err, existing_files) => {
        if (err) {
            console.error('Check destination existing_files Error', err)
        } else if (!!existing_files && !!existing_files.length) {
            let removed_files = 0
            const { length } = existing_files

            existing_files.forEach((file) => {
                const file_path = path.join(__dirname, new_dir_name, file)

                fs.rm(file_path, (err) => {
                    if (err) {
                        console.error('Error removing files: ', err)
                    } else {
                        removed_files++
                        if (length === removed_files) fs.rmdir(new_dir_destination_path, createNewFolder)
                    }
                })
            })
        } else {
            fs.rmdir(new_dir_destination_path, createNewFolder)
        }
    })
}

const createNewFolder = () => fs.mkdir(new_dir_destination_path, createNewFiles)

const createNewFiles = () => {
    let files_created = 0

    files.forEach((file, i) => {
        const new_file_name = `${base_file_name}${i + 1}${path.extname(file)}`
        const file_path = path.join(__dirname, folder_name, file)
        const new_file_destination_path = path.join(__dirname, new_dir_name, new_file_name)

        fs.copyFile(file_path, new_file_destination_path, (err) => {
            if (err) {
                console.error('Error copying files: ', err)
            } else {
                files_created++
                if (files.length === files_created) finish()
            }
        }) 
    });
}

const finish = () => console.log('All Files are copied succesfully')
start()

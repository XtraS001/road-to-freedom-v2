package com.example.backend.users.mapper;

import com.example.backend.users.User;
import com.example.backend.users.data.UserDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toEntity(UserDto userDto);

    UserDto toDto(User user);
}
